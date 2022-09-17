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

app.get('/asta/:asta_id/close', controller.setAuctionWon)

app.use([checkHeader, checkToken, verifyAndAuthenticate]);

app.get('/storico/aste/closed', controller.getMyClosedAste);

app.get('/storico/aste', controller.getMyAste);

app.get('/credito', controller.getMyCredito);

app.post('/asta/offerta', controller.newOfferta)

app.patch('/admin/accredito', controller.updateCredito);





const HEADER_PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\n';
const FOOTER_PRIVATE_KEY = '\n-----END PRIVATE KEY-----';
const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;


const privateKey = HEADER_PRIVATE_KEY+'MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAMMsV0E0hp8aCCW8QdTLUfl7lEzUzLbSyO/Y0XehBa8x+BWJav9gMlbp1GiL2oXeM2CKCRGVVJBnHSoBl+3x/l4q9BASVtMkLbWoe62OaHPZakN7o4rfil7KyIAER+rOqDtnJmtXhc2ZeA/1olUQ4FAQterj0CbAgVE2DroWMZXVAgMBAAECgYEAqhkR7p01mqIYabLZ+Pg+eF1w0UlBJTEtuINRg55NkvPM0BBUtT8EgGUIHxmMGNGgG0oSP0XTTorfiwWagOFAGw8xEDxRbiJNisN7LW9J9M+HV3ZU4SIv05Bp4LgLcqOPVhdFz/DGn5CRFC4WSFNtlM0T+8cTDY2QecQxf6Ow1p0CQQD94TVA3wCoKpEvNMKGJcJtvptKkE38Rw2evsxhff+Rj+drCFycsW7RUeLbZqQinuhDZ25fus1eIFaAnfdXwDkTAkEAxM2ec9ugQESu0N/BcQIcbmrWg9IhO7vgM5DTRl5bKxYbRoYkiWY0d1XUipUEH3bOzO5aHbpjWFbFs4eqJUx6dwJBAK0BbzzJurTebRlyJq0rxhbrMP/a3onwEYQAGV7GcgZLvjPd+t58uzvBRYqlo2xERZrJPRnXPmPKPahf/VG7GCkCQGQe61arzAoGJx2SR/ozBb3S0pE7jLaz7Oqu6h0pkZ4I4BVv1xSjj1uKqdda2j8blTfCpsvq7/GYK3obMZ9KGh8CQQDzrvgOblEt7y2f7R1GGX0lKC03X4g3aouOhtbuN1b3pp8jPqwQbWCNYb7BwG91S9vZGK/yQ2e5gNvS93BG6ATH'+FOOTER_PRIVATE_KEY;
const text_b64 = 'VCVcDQTEKUUIr27fOiz1KIslA2fiUqF36ZR+PYhI9Imy9H1d8QtLLx7rcETTDnYWITwtAeAUlvYQPrEtx9MDmbJrGlqcsljycmWYFgGJAHA/w+oYZJu9A/YR1vgM3sAIFGbOO1/eQDLWax62jsVC6Se/BPAHP00DYWsY5Z+Jum0='


console.log(base64regex.test(text_b64))

const decryptedData = crypto.privateDecrypt(
  {
    key: privateKey,
    padding: crypto.constants.RSA_PKCS1_PADDING
  },
  Buffer.from(text_b64, 'base64')
);
let offertaOBJ = JSON.parse(decryptedData.toString());
console.log("decrypted offer: ", offertaOBJ.offerta);




app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);