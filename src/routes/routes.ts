import { Router } from "express";
import { Controller } from "../controllers/controller";
import { checkHeader, checkToken, checkAuthentication, isAdmin, isBidCreator, isBidParticipant} from "../middleware/middlewareAuth";
import { errorLog, errorHandler } from "../middleware/middlewareErrors";
import { createWSS } from "../websockets/websocketserver";

const controller = new Controller();

const router: Router = Router();

/**
 * davanti ad ogni rotta metterei: /api/String(process.env.npm_package_version)/..
 */


// Rotta che simula la chiamata di un servizio esterno che fornisce un WSS in ascolto
// per una determinata asta
router.post('/redirect/WSServer', (req: any, res: any, next: any) =>{
    try{
      createWSS(req.body);
      res.status(200).json({"server_activated": true})
    }
    catch(err){
      next(err);
    }
  });
  
// Rotta che restituisce l'elenco di aste esistenti (filtro per stato)
router.get('/aste', controller.getListAste);

// Rotta utilizzata per poter chiudere un'asta e determinare il vincitore
router.get('/asta/:asta_id/close', controller.setAuctionWon);

// Rotta che permette di aprire una certa asta
router.get('/asta/:asta_id/open', controller.openAsta);

router.use([checkHeader, checkToken, checkAuthentication]);

// Rotta che permette di creare una nuova asta
router.post('/asta', isBidCreator, (req: any, res: any, next: any) => {
controller.createAsta(req, res, next);
});

// Rotta che permette di aggiungere del credito ad un determinato utente
router.patch('/admin/accredito', isAdmin, (req: any, res: any, next: any) => { 
controller.updateCredito(req, res, next);
});

// Rotta che restituisce il credito dell'utente autenticato
router.get('/credito', isBidParticipant, (req: any, res: any, next: any) => {
    controller.getMyCredito(req, res, next);
});

// Rotta che permette di effettuare una nuova offerta per una certa asta
router.post('/asta/offerta', isBidParticipant, (req: any, res: any, next: any) => { 
controller.newOfferta(req, res, next);
});

// Rotta che restituisce l'elenco delle aste chiuse alle quali si è partecipato,
// specificando quali sono state aggiudicate
router.get('/storico/aste/closed', isBidParticipant, (req: any, res: any, next: any) => {
controller.getMyClosedAste(req, res, next);
});

// Rotta che restituisce l'elenco delle aste alle quali si è partecipato / si sta partecipando,
// listando tutti gli eventuali rilanci
router.get('/storico/aste', isBidParticipant, (req: any, res: any, next: any) => {
controller.getMyAste(req, res, next);
});


export default router;