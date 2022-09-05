const express = require('express');
import * as userController from './controller/userController';
import { isAdmin } from './middleware/auth';
import { validateData } from './middleware/validator';
 
// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
// App
const app = express();
app.use(express.json());

/*app.get('/area', isAdminCheck, (req, res) => {  
  res.status(200)
  .end('Questa area personale è di: ' + req.decoded.username + '\n' + 'email: ' + req.decoded.email);
});

app.post('/addOrder', [isAdminCheck,  orderController.newOrder]);

app.get('/orders', orderController.orderList);

*/


app.get('/', (req: any, res: any) => {
  res.send('Benvenuto alla home di Express!');
});

app.get('/users', userController.userList);

app.post('/addCredit', [isAdmin, validateData, userController.addCredit]);

app.get('/users/:id', userController.getUserById);



app.use((err,req,res, next) => {
  res.status(err.status).send(err.stack);
})



app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
