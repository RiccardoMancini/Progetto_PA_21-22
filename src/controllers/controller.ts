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
}