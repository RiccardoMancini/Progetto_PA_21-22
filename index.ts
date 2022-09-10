import express from "express";
import { DB_Connection } from "./src/config/db_connection";
import { Controller } from "./src/controllers/controller";
const controller = new Controller();

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
// App
const app = express();
app.use(express.json());


app.get('/', (req: any, res: any) => {
  let conn = DB_Connection.getInstance().getConnection();
  console.log(conn)
});

app.get('/utenti', controller.getListUsers);

app.get('/aste', controller.getListAste);

app.get('/part', controller.getListPartecipazioni);



app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
