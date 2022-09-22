import { MessageCode, Message, factoryMsg } from '../factory/messageFactory';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
Object.assign(global, { WebSocket: require('ws') });
import jwt from 'jsonwebtoken';
import axios from 'axios';
import * as dotenv from "dotenv";
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../..', './.env') });

(async () => {

  function rilancio(base_asta: number, myCredito: number){
    console.log("Credito: ", myCredito);
    let offerta: number;
    if(base_asta > myCredito) return 0;
    else{
      offerta = base_asta + ((myCredito - base_asta)*10/100);
      console.log(`Base d'asta attuale: ${Number(base_asta)} - Offerta: ${Number(offerta)}`)
      return Number(offerta.toFixed(3));
      
    }
  }

  let token: string;
  switch (process.argv[2]) {
    case "1":
      token = process.env.TOKEN1;
      break;
    case "2":
      token = process.env.TOKEN2;
      break;
    case "3":
    token = process.env.TOKEN3;
    default:
      break;
  }

  let credito = await axios.get('http://localhost:8080/credito',{
    headers: { Authorization: `Bearer ${token}` }}).then(value => value.data.credito)
  console.log(credito);
  let decoded = jwt.verify(token, process.env.SECRET_KEY);
  let user_id: number = decoded.id;
  let globalTimer: ReturnType<typeof setTimeout>;
  let actualCredito = credito;
  let asta_id: number;

  const subject = webSocket(`ws://localhost:8081/websocket?user_id=${user_id}&tok_id=${process.argv[2]}`);

  subject.subscribe({
    next: (data: any) => {

      let msg : Message = data;

      if (msg.type === MessageCode.WELCOME){
        asta_id = msg.asta_id;
        console.log(`${msg.message} ${asta_id}. La base d'asta è di: ${msg.base_asta}`);
        subject.next(factoryMsg.getMessage(MessageCode.CLIENT_CHECK))
      }


      else if (msg.type === MessageCode.PRE_START){
        console.log(msg.message)
        console.log(`Prepara la tua offerta ${user_id}!`);      
      }


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
      //CHECK THIS ERRORS!!!!
      console.log({"error-code": err.code, "reason": 'Abnormal Function!'});
    },
    complete: () => console.log('Arrivederci!')
  });

})();