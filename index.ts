import express from "express";
import { Controller } from "./src/controllers/controller";
import { checkHeader, checkToken, isBidCreator, verifyAndAuthenticate } from "./src/middleware/middlewareAuth";
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
  
  console.log(req.body);
  createWSS(req.body);

  //serve una rispostaa!!!



})

/**
 * il filtraggo delle aste avviene tramite query string. 
 * es1: localhost:8080/aste  <-- mostra tutte le aste
 * es2: localhost:8080/aste?stato=2  <-- mostra le aste filtrate con stato
 */
app.get('/aste', controller.getListAste);

app.get('/asta/new', controller.createAsta)

app.get('/asta/:asta_id/close', controller.setAuctionWon);

app.patch('/asta/:asta_id/open', controller.openAsta);

app.use([checkHeader, checkToken, verifyAndAuthenticate]);

app.get('/storico/aste/closed', controller.getMyClosedAste);

app.get('/storico/aste', controller.getMyAste);

app.get('/credito', controller.getMyCredito);

app.post('/asta/offerta', controller.newOfferta);

app.patch('/admin/accredito', controller.updateCredito);



app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);