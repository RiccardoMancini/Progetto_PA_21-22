import express from "express";
import router from "./src/routes/routes";
import { ErrEnum, ErrorFactory } from "./src/factory/errorFactory";
import { errorLog, errorHandler } from "./src/middleware/middlewareErrors";
import { createWSS } from "./src/websockets/websocketserver";

const PORT = 8080;
const HOST = '0.0.0.0';
const app = express();
app.use(express.json());


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

// Rotta principale che riporta a tutte le altre rotte
app.use(`/api/v${process.env.npm_package_version.toString()}`, router);

// Rotte non gestite dal sistema
app.all('*', function (req, res, next) {
  try{
    throw new ErrorFactory().getError(ErrEnum.BadRequest)
  }
  catch(err){
    next(err);
  }
})

// Middleware per la gestione degli errori
app.use([errorLog, errorHandler])

const server = app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);