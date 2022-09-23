import { MessageCode, Message, factoryMsg } from '../factory/messageFactory';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
Object.assign(global, { WebSocket: require('ws') });
import jwt from 'jsonwebtoken';
import axios, { AxiosError } from 'axios';
import * as dotenv from "dotenv";
import path from 'path';
import { ErrEnum, ErrorFactory } from '../factory/errorFactory';
dotenv.config({ path: path.join(__dirname, '../..', './.env') });
import { tokenToReturn } from './websocketserver'

(async () => {
  /**
   * Funzione che simula il rilancio da parte di un concorrente
   * @param base_asta valore attuale della base d'asta
   * @param myCredito credito di un certo utente
   * @returns 0 se il credito non è sufficiente, altrimenti l'offerta fatta
   */
  function rilancio(base_asta: number, myCredito: number){
    //console.log("Credito: ", myCredito);
    let offerta: number;
    if(base_asta > myCredito) return 0;
    else{
      // si è scelto di rialzare la base d'asta con un'offerta pari
      // al 10% della differenza tra il credito attuale e la base d'asta attuale
      offerta = base_asta + ((myCredito - base_asta)*10/100);
      console.log(`Base d'asta attuale: ${Number(base_asta)} - Offerta: ${Number(offerta)}`)
      return Number(offerta.toFixed(3));
      
    }
  }

  let token: string = tokenToReturn(Number(process.argv[2]));
  
  let credito = await axios.get('http://localhost:8080/api/v1.0.0/credito',{ headers: { Authorization: `Bearer ${token}` }})
                           .then(value => value.data.credito).catch(err => console.log(err.stack));
  console.log(credito);
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  const user_id: number = decoded.id;
  const user_name: string = decoded.name;
  let globalTimer: ReturnType<typeof setTimeout>;
  let actualCredito: number = credito;
  let asta_id: number;

  // Connessione alla stanza dedicata all'asta con passaggio di parametri necessari
  const subject = webSocket(`ws://localhost:8081/websocket?user_id=${user_id}&tok_id=${process.argv[2]}`);

  subject.subscribe({
    next: (data: any) => {

      let msg : Message = data;
      // Messaggio di benvenuto da parte del server
      if (msg.type === MessageCode.WELCOME){
        asta_id = msg.asta_id;
        console.log(`${msg.message} ${asta_id}. La base d'asta è di: ${msg.base_asta}`);
        subject.next(factoryMsg.getMessage(MessageCode.CLIENT_CHECK))
      }

      // Si sta per iniziare...
      else if (msg.type === MessageCode.PRE_START){
        console.log(msg.message)
        console.log(`Prepara la tua offerta ${user_name}!`);      
      }

      // Il rilancio dell'offerta da parte dei client avviene in maniera asincrona
      // per simulare gli istanti in cui un concorrente formula una decisione
      else if (msg.type === MessageCode.START){
        globalTimer = setTimeout(() => {
          console.log('Rilancia!')
          let offerta = rilancio(msg.offerta, actualCredito);
          if(offerta > 0){
            subject.next(factoryMsg.getMessage(MessageCode.OFFER, offerta));
          }
          else{
            subject.next(factoryMsg.getMessage(MessageCode.NO_CREDIT));
          }
        }, (Math.random() + 2) * 2000);

      }

      // Messaggio di wait da parte del server, in quanto un altro client
      // sta già rialzando l'attuale base d'asta
      else if (msg.type === MessageCode.WAIT)
      {      
        clearTimeout(globalTimer);
        console.log(msg.message)
      }
      
      else if(msg.type === MessageCode.TOO_LATE || msg.type === MessageCode.CLOSE){
        console.log(msg.message);
      }

      else if(msg.type === MessageCode.WINNER){
        console.log(msg.message, msg.offerta);
      }

      else console.log('Numero utenti collegati:', data);
      
    },
    
    error: err => {
      console.log({"error-code": err.code, "reason": 'Abnormal Function!'});
    },
    complete: () => console.log('Arrivederci!')
  });
})();