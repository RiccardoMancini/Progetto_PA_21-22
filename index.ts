import express from "express";
import { DB_Connection } from "./src/config/db_connection";
import { Controller } from "./src/controllers/controller";
import { checkHeader, checkToken, isBidCreator, verifyAndAuthenticate } from "./src/middleware/middlewareAuth";
import crypto from 'crypto';
const axios = require('axios').default;


const controller = new Controller();

const PORT = 8080;
const HOST = '0.0.0.0';


const app = express();
app.use(express.json());

/**
 * davanti ad ogni rotta metterei: /api/String(process.env.npm_package_version)/..
 */



/**
 * il filtraggo delle aste avviene tramite query string. 
 * es1: localhost:8080/aste  <-- mostra tutte le aste
 * es2: localhost:8080/aste?stato=2  <-- mostra le aste filtrate con stato
 */
app.get('/aste', controller.getListAste);


app.get('/aste2', async (req, res) =>{
  const aste = await axios.get('http://localhost:8080/aste')
  console.log(aste.data)


})

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