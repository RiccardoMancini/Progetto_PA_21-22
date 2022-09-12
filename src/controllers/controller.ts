import { Utenti } from '../models/utenti'
import { Asta } from '../models/asta';
import { Partecipazione } from '../models/partecipazione';

export class Controller {

    public async getListUsers(req: any, res:any){
        const users = await new Utenti().getUtenti();

        res.send(users);
    }

    public async getListAste(req: any, res:any){
        const aste = await new Asta().getAste();

        res.send(aste);
    }

    public async getListPartecipazioni(req: any, res: any){
        let part = await new Partecipazione().getPartecipazioni()

        res.send(part);
    }

    /**
     * aggiornamento del credito
     */
    public async updataCredito ( req:any, res:any){
        let user_id = req.idreq; 
        let oldcrediti = await new Utenti().getUtenteById(user_id);
        console.log(oldcrediti);
        let upcredito = oldcrediti.credito + req.adcredito;
        await upcredito.save(); 
        res.status(200).send(upcredito);
    }


    /**
     * Creazione di una nuova asta
     */

    public async createAsta ( req:any, res:any){
        const aste = await new Asta().getModelAsta();
        let newrowasta = req.body;
        let newasta = await aste.create(newrowasta);  
        res.send(newasta);
    }

    /**
     * verifica del credito dell'utente
     */

     public async verificaCredito( req:any, res:any){
        let user_id = req.idreq; 
        let userbyid = await new Utenti().getUtenteById(user_id);
        let credituser  = userbyid.credito;
        res.send(credituser);
     }


    
}

