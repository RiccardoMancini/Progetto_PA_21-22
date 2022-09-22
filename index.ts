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



 app.post('/redirect/WSServer', (req: any, res: any) =>{
  createWSS(req.body);
  // mettere stato 200, cosi nel controller può checkare questo!
  res.send({"server_active": true})

});

app.get('/aste', controller.getListAste);

app.get('/asta/:asta_id/close', controller.setAuctionWon);

app.patch('/asta/:asta_id/open', controller.openAsta);

app.use([checkHeader, checkToken, checkAuthentication]);

app.post('/asta/new', isBidCreator, (req: any, res: any, next: any) => {
  controller.createAsta(req, res, next);
});

app.patch('/admin/accredito', isAdmin, (req: any, res: any, next: any) => { 
  controller.updateCredito(req, res, next);
});

app.get('/credito', isBidParticipant, (req: any, res: any, next: any) => {
   controller.getMyCredito(req, res, next);
});

app.post('/asta/offerta', isBidParticipant, (req: any, res: any, next: any) => { 
  controller.newOfferta(req, res, next);
});

app.get('/storico/aste/closed', isBidParticipant, (req: any, res: any, next: any) => {
  controller.getMyClosedAste(req, res, next);
});
app.get('/storico/aste', isBidParticipant, (req: any, res: any, next: any) => {
  controller.getMyAste(req, res, next);
});

// Rotte non gestite
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