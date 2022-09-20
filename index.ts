import express from "express";
import { Controller } from "./src/controllers/controller";
import { checkHeader, checkToken, isAdmin, isBidCreator, isBidParticipant} from "./src/middleware/middlewareAuth";
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

 app.post('/redirect/WSServer', (req: any, res: any) =>{
  createWSS(req.body);  
  res.send({"server_active": true})

});

/**
 * il filtraggo delle aste avviene tramite query string. 
 * es1: localhost:8080/aste  <-- mostra tutte le aste
 * es2: localhost:8080/aste?stato=2  <-- mostra le aste filtrate con stato
 */
app.get('/aste', controller.getListAste);

app.get('/asta/:asta_id/close', controller.setAuctionWon);

app.patch('/asta/:asta_id/open', controller.openAsta);

app.use([checkHeader, checkToken]);

app.post('/asta/new', isBidCreator, (req: any, res: any, next: any) => {
  controller.createAsta(req, res, next);
});

app.patch('/admin/accredito', isAdmin, (req: any, res: any, next: any) => { 
  controller.updateCredito(req, res, next);
});

app.use(isBidParticipant);

app.get('/credito', controller.getMyCredito);

app.post('/asta/offerta', controller.newOfferta);

app.get('/storico/aste/closed', controller.getMyClosedAste);

app.get('/storico/aste', controller.getMyAste);

app.use([errorLog, errorHandler])




const server = app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);