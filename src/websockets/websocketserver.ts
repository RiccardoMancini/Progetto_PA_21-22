import {WebSocket, WebSocketServer} from 'ws';
import { MessageCode, Message, factoryMsg } from './message';
import * as dotenv from "dotenv";
import path from 'path';
import axios from 'axios';
dotenv.config({ path: path.join(__dirname, '../..', './.env') });

export function createWSS(asta: any){

  let base_asta = asta.p_min;
  console.log(`Stanza dedicata all'asta con ${asta.asta_id}, in ascolto sulla porta: ${process.env.WSSPORT}. Si parte da una base d'asta di ${base_asta}!`);

  let n_client = +process.env.N_CLIENTS;
  let ws_userID = [];
  let semaphore = true;
  let bestOffer = base_asta;
  let token: string;

  const wss = new WebSocketServer({ port: +process.env.WSSPORT, path: '/websocket' });

  function sendToAll(msg: any){
    wss.clients.forEach((client) => {
      client.send(msg);
    });
  }



  wss.on('connection', function connection(ws, req) {
    let app = req.url.split('?');
    app = app[1].split('&');
    ws_userID.push({"ws_id": req.headers['sec-websocket-key'], "user_id": Number(app[0].split('=')[1]), "offerte": [], "tok_id": Number(app[1].split('=')[1]), "ws": ws});
    console.log(ws_userID)
    let count = wss.clients.size;
    if (count <= n_client){
      sendToAll(count);    
      console.log("Nuovo concorrente collegato. Concorrenti totali:", count);
      setTimeout(() => {
        ws.send(JSON.stringify(factoryMsg.getMessage(MessageCode.WELCOME, 0, asta.asta_id, base_asta)));
      }, 3000);
    }
    
    //I RITARDATARI...
    if(count > n_client){
      ws.send(JSON.stringify(factoryMsg.getMessage(MessageCode.TOO_LATE)))
      ws.close();
    }
      
    
    ws.on('message', function message(data: any) {

      let dataParsed = JSON.parse(data);

      if (count >= n_client && dataParsed.type === MessageCode.CLIENT_CHECK){
        setTimeout(() => {
          sendToAll(JSON.stringify(factoryMsg.getMessage(MessageCode.PRE_START)));
        }, 2000);

        // STARTING IN 15 SECONDS FROM NOW...
        setTimeout(() => {
          sendToAll(JSON.stringify(factoryMsg.getMessage(MessageCode.START, base_asta)));
        }, 10 * 1000);
      }

    
      if(dataParsed.type === MessageCode.OFFER && semaphore){
        semaphore = false;
        let client_offer = ws_userID.find(item => item.ws_id === req.headers['sec-websocket-key']);
        client_offer.offerte.push(dataParsed.offerta);

        wss.clients.forEach((client) => {
          if(client !== client_offer.ws){ 
            client.send(JSON.stringify(factoryMsg.getMessage(MessageCode.WAIT)));        
          }
        });       

        console.log("L'utente: " + client_offer.user_id+ " ha alzato la base d'asta da "+ bestOffer + ' a '+ client_offer.offerte[client_offer.offerte.length - 1]);
        console.log("Elenco dei suoi rilanci: ", client_offer.offerte);

        bestOffer = dataParsed.offerta;
        semaphore = true;

        wss.clients.forEach((client) => {
          if(client !== client_offer.ws){
            client.send(JSON.stringify(factoryMsg.getMessage(MessageCode.START, bestOffer)));        
          }
        }); 
      }

      else if(dataParsed.type === MessageCode.NO_CREDIT){
        ws.send(JSON.stringify(factoryMsg.getMessage(MessageCode.CLOSE)))
        setTimeout(() => {ws.close(1000)}, 1000);
        
      }
    });

    ws.on("error", function(err) {
      console.log('Received error: ', err);
      ws.close();
    })

    ws.on("close", async function(code: number){
      //DA FINIRE DI GESTIRE CON TUTTE LE ECCEZIONI!
      let exit_client = ws_userID.find(item => item.ws_id === req.headers['sec-websocket-key']);
      if(code === 1000 || code === 1006){      
        console.log(`L'utente ${exit_client.user_id} ha concluso l'asta!`);
        ws_userID = ws_userID.filter(elem => elem !== exit_client);
        if(code === 1006){
          //DELETE OFFER
        }
        switch (exit_client.tok_id){
          case 1:
            token = process.env.TOKEN1;
            break;
          case 2:
            token = process.env.TOKEN2;
            break;
          default:
            break;
        }
          

        exit_client.offerte.sort((a, b) => a - b).map(async (value) => {
          let response = await axios.post('http://localhost:8080/asta/offerta',{
              "asta_id": asta.asta_id,
              "offerta": value
              }, { headers: { Authorization: `Bearer ${token}` }});

        });
        /**/
      }
      console.log(code)

      if(wss.clients.size === 1 && bestOffer !== base_asta){
        //the winner!
        let winner_client = ws_userID[0];
        switch (winner_client.tok_id){
          case 1:
            token = process.env.TOKEN1;
            break;
          case 2:
            token = process.env.TOKEN2;
            break;
          default:
            break;
        };

        console.log(`L'utente ${winner_client.user_id} si è aggiudicato l'asta!`);

        winner_client.offerte.sort((a, b) => a - b).map(async (value) => {
          let response = await axios.post('http://localhost:8080/asta/offerta',{
              "asta_id": asta.asta_id,
              "offerta": value
              }, { headers: { Authorization: `Bearer ${token}` }});

        });

        wss.clients.forEach((client) => {
          client.send(JSON.stringify(factoryMsg.getMessage(MessageCode.WINNER, winner_client.offerte[winner_client.offerte.length - 1])));
          setTimeout(() => {client.close()}, 1000);  

        });
        console.log('Asta conclusa! A breve verranno registrati i risultati.');
        //let response = await axios.get(`http://localhost:8080/asta/${asta.asta_id}/close`);
        //if(response.status === 200) 
      }
      
      
    })
  });
}
