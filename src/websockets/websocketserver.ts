import {WebSocketServer} from 'ws';
import { MessageCode, Message, factoryMsg } from './Message';
import * as dotenv from "dotenv";
import path from 'path';
dotenv.config({ path: path.join(__dirname, '..', './.env') });

export function createWSS(asta: any){

  let base_asta = 5;
  console.log(`Stanza dedicata all'asta con ID, in ascolto sulla porta: ${process.env.PORT}. Si parte da una base d'asta di ${base_asta}!`);

  let n_client = +process.env.N_CLIENTS;
  let ws_userID = [];
  let semaphore = true;
  let bestOffer = base_asta;

  const wss = new WebSocketServer({ port: +process.env.WSSPORT });

  function sendToAll(msg: any){
    wss.clients.forEach((client) => {
      client.send(msg);
    });
  }



  wss.on('connection', function connection(ws, req) {
    ws_userID.push({"ws_id": req.headers['sec-websocket-key'], "user_id": Number(req.url.replace('/?user_id=', '')), "offerte": [], "ws": ws});

    let count = wss.clients.size;
    if (count <= n_client){
      sendToAll(count);    
      console.log("Nuovo concorrente collegato. Concorrenti totali:", count);

      setTimeout(() => {
        ws.send(JSON.stringify(factoryMsg.getMessage(MessageCode.WELCOME, 0, 2, base_asta)));
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

    ws.on("close", function(code: number){
      let exit_client = ws_userID.find(item => item.ws_id === req.headers['sec-websocket-key']);
      if(code === 1000){      
        console.log(`L'utente ${exit_client.user_id} ha concluso l'asta!`);
        ws_userID = ws_userID.filter(elem => elem !== exit_client)
                .map(elem => { 
                    //console.log(elem.ws_id, elem.user_id, elem.offerte);
                    return elem;
                  });
        //add offerte di questo utente con axios
      }

      if(wss.clients.size === 1){
        //the winner is!!!
        let winner_client = ws_userID[0];
        //console.log(winner_client.ws_id, winner_client.user_id, winner_client.offerte)
        wss.clients.forEach((client) => {
          client.send(JSON.stringify(factoryMsg.getMessage(MessageCode.WINNER, bestOffer)));
          setTimeout(() => {client.close()}, 1000);

        })
        //add offerte di questo utente con axios

        //WSS CLOSE
      }
      
      
    })
  });
}
