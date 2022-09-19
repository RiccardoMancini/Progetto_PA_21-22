import { MessageCode, Message, factoryMsg } from './Message';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
Object.assign(global, { WebSocket: require('ws') });
import axios from 'axios';



/*const creditoByUserID = await axios.get('http://localhost:8080/credito',{
  headers: { Authorization: `Bearer ${process.env.TOKEN}` }}).then(value => console.log(value));
*/
//console.log(creditoByUserID);

function rilancio(base_asta: number, myCredito: number){
  console.log("Credito: ", myCredito);
  let offerta: number;
  if(base_asta > myCredito) return 0;
  else{
    offerta = base_asta + ((myCredito - base_asta)*10/100);
    console.log(`Base d'asta attuale: ${Number(base_asta)} - Offerta: ${Number(offerta)}`)
    return offerta;
    
  }
}

let userStats = {
  "user_id": Math.floor(Math.random() * 80),
  "credito": Math.random()* 500
}


let globalTimer;
let actualCredito = userStats.credito;


const subject = webSocket('ws://localhost:8081?user_id='+userStats.user_id);
/*
subject.subscribe({
  next: (data: any) => {

    let msg : Message = data;

    if (msg.type === MessageCode.WELCOME){
      console.log(`${msg.message} ${msg.asta_id}. La base d'asta è di: ${msg.base_asta}`);
      subject.next(factoryMsg.getMessage(MessageCode.CLIENT_CHECK))
    }


    else if (msg.type === MessageCode.PRE_START){
      console.log(msg.message)
      console.log(`Prepara la tua offerta ${userStats.user_id}!`);      
    }


    else if (msg.type === MessageCode.START){
      globalTimer = setTimeout(() => {
        console.log('Rilancia!')
        let offerta = rilancio(msg.offerta, actualCredito);
        if(offerta > 0){
          actualCredito = actualCredito - offerta;
          subject.next(factoryMsg.getMessage(MessageCode.OFFER, offerta));
        }
        else{
          subject.next(factoryMsg.getMessage(MessageCode.NO_CREDIT));
        }
      }, (Math.random() + 1) * 5000);

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
    console.log({"error-code": err.code, "reason": 'Abnormal Closure!'});
  },
  complete: () => console.log('Arrivederci!')
 });
*/