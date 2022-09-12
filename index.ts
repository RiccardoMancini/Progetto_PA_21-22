import express from "express";
import { DB_Connection } from "./src/config/db_connection";
import { Controller } from "./src/controllers/controller";
import { checkHeader, checkToken, isBidCreator } from "./src/middleware/middlewareAuth";
const controller = new Controller();

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
// App
const app = express();
app.use(express.json());

app.use([checkHeader, checkToken]);


app.get('/', (req: any, res: any) => {
  let conn = DB_Connection.getInstance().getConnection();
  console.log(conn)
});

app.get('/utenti', controller.getListUsers);

app.get('/aste', controller.getListAste);

app.get('/part', isBidCreator, (req, res) => {
   controller.getListPartecipazioni(req, res);
});

app.get('/cre',controller.updataCredit);



app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
