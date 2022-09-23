import express from "express";
import { Controller } from "./src/controllers/controller";
import { ErrEnum, ErrorFactory } from "./src/factory/errorFactory";
import { checkHeader, checkToken, checkAuthentication, isAdmin, isBidCreator, isBidParticipant} from "./src/middleware/middlewareAuth";
import { errorLog, errorHandler } from "./src/middleware/middlewareErrors";
import { createWSS } from "./src/websockets/websocketserver";


const controller = new Controller();

const PORT = 8080;
const HOST = '0.0.0.0';


const app = express();
app.use(express.json());

/**
 * davanti ad ogni rotta metterei: /api/String(process.env.npm_package_version)/..
 */

// Rotta che simula la chiamata di un servizio esterno che fornisce un WSS in ascolto
// per una determinata asta
app.post('/redirect/WSServer', (req: any, res: any, next: any) =>{
  try{
    createWSS(req.body);
    res.status(200).json({"server_activated": true})
  }
  catch(err){
    next(err);
  }
});

// Rotta che restituisce l'elenco di aste esistenti (filtro per stato)
app.get('/aste', controller.getListAste);

// Rotta utilizzata per poter chiudere un'asta e determinare il vincitore
app.get('/asta/:asta_id/close', controller.setAuctionWon);

// Rotta che permette di aprire una certa asta
app.patch('/asta/:asta_id/open', controller.openAsta);

app.use([checkHeader, checkToken, checkAuthentication]);

// Rotta che permette di creare una nuova asta
app.post('/asta/new', isBidCreator, (req: any, res: any, next: any) => {
  controller.createAsta(req, res, next);
});

// Rotta che permette di aggiungere del credito ad un determinato utente
app.patch('/admin/accredito', isAdmin, (req: any, res: any, next: any) => { 
  controller.updateCredito(req, res, next);
});

// Rotta che restituisce il credito dell'utente autenticato
app.get('/credito', isBidParticipant, (req: any, res: any, next: any) => {
   controller.getMyCredito(req, res, next);
});

// Rotta che permette di effettuare una nuova offerta per una certa asta
app.post('/asta/offerta', isBidParticipant, (req: any, res: any, next: any) => { 
  controller.newOfferta(req, res, next);
});

// Rotta che restituisce l'elenco delle aste chiuse alle quali si è partecipato,
// specificando quali sono state aggiudicate
app.get('/storico/aste/closed', isBidParticipant, (req: any, res: any, next: any) => {
  controller.getMyClosedAste(req, res, next);
});

// Rotta che restituisce l'elenco delle aste alle quali si è partecipato / si sta partecipando,
// listando tutti gli eventuali rilanci
app.get('/storico/aste', isBidParticipant, (req: any, res: any, next: any) => {
  controller.getMyAste(req, res, next);
});




// Rotte non gestite dal sistema
app.all('*', function (req, res, next) {
  try{
    throw new ErrorFactory().getError(ErrEnum.BadRequest)
  }
  catch(err){
    next(err);
  }
})

app.use([errorLog, errorHandler])

const server = app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);