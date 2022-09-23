import {WebSocket, WebSocketServer} from 'ws';
import { MessageCode, Message, factoryMsg } from '../factory/messageFactory';
import * as dotenv from "dotenv";
import path from 'path';
import axios from 'axios';
dotenv.config({ path: path.join(__dirname, '../..', './.env') });

// Funzione che ritorna il token JWT dal .env in base al client che lo richiede
export function tokenToReturn(token_id: number): string{
  let token: string;
  const key_name: string = 'TOKEN' + token_id;
  if(key_name in process.env){
    token = process.env[key_name];
    return token;
  }
  else{
    throw new Error('Token non trovato tra le variabili di ambiente!');
  }

}

export function createWSS(asta: any): void{
  function sendToAll(msg: any): void{
    wss.clients.forEach((client) => {
      client.send(msg);
    });
  }

  

  const n_client: number = +process.env.N_CLIENTS; // Limite di client che possono connettersi
  let base_asta: number = asta.p_min;
  //console.log(n_client)
  let ws_userID: Array<any> = [];
  let semaphore: boolean = true;
  let bestOffer: number = base_asta;
  let token: string;

  console.log(`Stanza dedicata all'asta con ID: ${asta.asta_id}, in ascolto sulla porta: ${process.env.WSSPORT}. Si parte da una base d'asta di ${base_asta}!`);

  const wss = new WebSocketServer({ port: +process.env.WSSPORT, path: '/websocket' });

  wss.on('connection', function connection(ws, req) {
    // Estrazione del'user_id dall'url della richiesta di connessione
    let app: Array<string> = req.url.split('?');
    app = app[1].split('&');    
    // Il vettore di oggetti ws_userID permette di associare l'id dei concorrenti con le info dei rispettivi client
    ws_userID.push({"ws_id": req.headers['sec-websocket-key'], "user_id": Number(app[0].split('=')[1]), "offerte": [], "tok_id": Number(app[1].split('=')[1]), "ws": ws});
    //console.log(ws_userID)
    let count: number = wss.clients.size;
    if (count <= n_client){
      sendToAll(count);    
      console.log("Nuovo concorrente collegato. Concorrenti totali:", count);
      setTimeout(() => {
        //Messaggio di benvenuto ai nuovi concorrenti collegati
        ws.send(JSON.stringify(factoryMsg.getMessage(MessageCode.WELCOME, 0, asta.asta_id, base_asta)));
      }, 3000);
    }    
    // Gestione ritardatari...
    if(count > n_client){
      ws.send(JSON.stringify(factoryMsg.getMessage(MessageCode.TOO_LATE)))
      ws.close();
    }      
    
    ws.on('message', function message(data: any) {
      let dataParsed = JSON.parse(data);
      // Doppio check sull'effettiva persistenza del numero di client
      if (count >= n_client && dataParsed.type === MessageCode.CLIENT_CHECK){
        setTimeout(() => {
          sendToAll(JSON.stringify(factoryMsg.getMessage(MessageCode.PRE_START)));
        }, 2000);

        // Inizio dell'asta in 10 secondi...
        setTimeout(() => {
          sendToAll(JSON.stringify(factoryMsg.getMessage(MessageCode.START, base_asta)));
        }, 10 * 1000);
      }

      // Ogni volta che un client fa un'offerta ha la possibilità di accedere alla
      // alla base d'asta di quel preciso momento, che di fatto viene trattata come
      // una risorsa critica alla quale è possibile accedere uno alla volta
      if(dataParsed.type === MessageCode.OFFER && semaphore){
        semaphore = false;
        // Si trova l'idendità del client che è appena entrato nella risorsa
        // e si trova quindi in procinto di rialzare la base d'asta
        let client_offer = ws_userID.find(item => item.ws_id === req.headers['sec-websocket-key']);
        client_offer.offerte.push(dataParsed.offerta);

        // Messaggio di wait a tutti gli altri client
        wss.clients.forEach((client) => {
          if(client !== client_offer.ws){
            client.send(JSON.stringify(factoryMsg.getMessage(MessageCode.WAIT)));        
          }
        });       

        console.log("L'utente: " + client_offer.user_id + " ha alzato la base d'asta da "+ bestOffer + ' a '+ client_offer.offerte[client_offer.offerte.length - 1]);
        console.log("Elenco dei suoi rilanci: ", client_offer.offerte);

        // Aggiornamento della migliore offerta, liberazione della risorsa critica
        // e segnalazione a tutti gli altri utenti della ripresa del gioco
        bestOffer = dataParsed.offerta;
        semaphore = true;
        wss.clients.forEach((client) => {
          if(client !== client_offer.ws){
            client.send(JSON.stringify(factoryMsg.getMessage(MessageCode.START, bestOffer)));        
          }
        }); 
      }

      // Quando un client non ha più credito viene scollegato
      else if(dataParsed.type === MessageCode.NO_CREDIT){
        ws.send(JSON.stringify(factoryMsg.getMessage(MessageCode.CLOSE)))
        setTimeout(() => {ws.close(1000)}, 1000);
        
      }
    });

    ws.on("error", function(err) {
      console.log('Errore ricevuto: ', err);
      ws.close();
    });

    ws.on("close", async function(code: number){
      let exit_client: any = ws_userID.find(item => item.ws_id === req.headers['sec-websocket-key']);
      if(code === 1000 || code === 1006){      
        console.log(`L'utente ${exit_client.user_id} ha concluso l'asta!`);
        ws_userID = ws_userID.filter(elem => elem !== exit_client);
        token = tokenToReturn(exit_client.tok_id);

        // Registrazione nel db dei rilanci effettuati dal concorrente che è appena uscito
        exit_client.offerte.sort((a, b) => a - b).map(async (value) => {
          await axios.post('http://localhost:8080/api/v1.0.0/asta/offerta', {"asta_id": asta.asta_id,"offerta": value},
          { headers: { Authorization: `Bearer ${token}` }}).catch(err => console.log(err.stack));
        });
      }
      //console.log(code)

      // Gestione del concorrente vincitore
      if(wss.clients.size === 1 && bestOffer !== base_asta){
        let winner_client: any = ws_userID[0];
        token = tokenToReturn(winner_client.tok_id);

        console.log(`L'utente ${winner_client.user_id} si è aggiudicato l'asta!`);

        // Registrazione nel db dei rilanci effettuati dal concorrente vincitore
        winner_client.offerte.sort((a, b) => a - b).map(async (value) => {
          await axios.post('http://localhost:8080/api/v1.0.0/asta/offerta', {"asta_id": asta.asta_id, "offerta": value},
          { headers: { Authorization: `Bearer ${token}` }}).catch(err => console.log(err.stack));
        });

        wss.clients.forEach((client) => {
          client.send(JSON.stringify(factoryMsg.getMessage(MessageCode.WINNER, winner_client.offerte[winner_client.offerte.length - 1])));
          setTimeout(() => {client.close()}, 1000);
        });

        console.log('Asta conclusa! A breve verranno registrati i risultati.');
      }      
    });
  });
}
