import { Utenti } from '../models/utenti'
import { Asta, stato_asta, tipo_asta} from '../models/asta';
import { Partecipazione } from '../models/partecipazione';

export class Controller {

    public async getListUsers(req: any, res:any){
        const users = await new Utenti().getUtenti();

        res.send(users);
    }

    public async getListAste(req: any, res:any){
        let aste = await new Asta().getAste();

        if(Object.keys(req.query).length !== 0){
            aste = aste.filter(asta => asta.stato === Number(req.query.stato));
        }

        if(aste.length !== 0)
        {
            aste.map((value: any) => {
                            value.tipo = value.tipo === tipo_asta.ASTA_CHIUSA_1? 'Asta_chiusa_1': 'Asta_chiusa_2';
                            switch (value.stato) {
                                case stato_asta.NON_APERTA:
                                    value.stato = stato_asta[1];
                                    break;
                                case stato_asta.IN_ESECUZIONE:
                                    value.stato = stato_asta[2];
                                    break;
                                case stato_asta.TERMINATA:
                                    value.stato = stato_asta[3];
                                    break;
                                default:
                                    break;
                            }
                        });
}
        else{
             aste = {"info": 'Non esistono aste in questo stato!'};
        }

        res.send(aste);
    }

    public async getListPartecipazioni(req: any, res: any){
        let part = await new Partecipazione().getPartecipazioni()

        res.send(part);
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
     * Verifica del credito dell'utente
     */
    public async getMyCredito(req: any, res: any){
        let credito = await new Utenti().getCreditoByUserID(req.user_id).then(value => value.credito);
        res.send({"credito": credito});
    }


    /**
     * Aggiornamento del credito di un determinato utente
     */
    public async updateCredito (req: any, res: any){
        let old_credito = await new Utenti().getCreditoByUserID(req.body.user_id).then(value => value.credito);
        let up_credito = old_credito + req.body.credito;
        console.log(up_credito);
        /*await upcredito.save(); 
        res.status(200).send(upcredito);*/
    }

    public async getMyClosedAste(req: any, res: any){
        /*const date_obj_i = new Date(Number(req.query.date_i));
        const date_obj_f = new Date(Number(req.query.date_f));*/
        let part = await new Partecipazione().getClosedAsteByUserID(req.user_id);
        part = part.sort((a, b) => { return a.asta_id - b.asta_id })
                .filter((elem, index, array) => {
                    if((index < array.length-1 && elem.asta_id === array[index+1].asta_id) || 
                    (index > 0 && elem.asta_id === array[index-1].asta_id)){
                        if((index < array.length-1 && elem.aggiudicata === array[index+1].aggiudicata) || 
                        (elem.aggiudicata === false &&  array[index+1].aggiudicata === true) || 
                        (elem.aggiudicata === false &&  array[index-1].aggiudicata === true)){
                            return false;                        
                        }               
                    } 
                    return true;
                });                       

        res.send(part)
    }

    public async getMyAste(req: any, res: any){
        let app = [];
        let rilanci = [];
        let part = await new Partecipazione().getAsteByUserID(req.user_id);
        part = part.sort((a, b) => { return b.part_id - a.part_id })
        .filter((elem) => {
            let obj = {"asta_id": elem.asta_id};
            let exists = app.find(value => value.asta_id === obj.asta_id);
            if (typeof exists==='undefined'){
                app.push(obj);
                rilanci.push({"asta_id": elem.asta_id, "offerta": [elem.offerta]});
                return true;
            }
            else{
                let obj2 = rilanci.find(value => value.asta_id === exists.asta_id);
                obj2.offerta.push(elem.offerta);                
                return false;
            }
        })
        .map((elem, index) => {
            return {
                "asta_id": elem.asta_id,
                "stato": elem.stato === 2? stato_asta[2]:stato_asta[3],
                "rilanci / offerta": rilanci[index].offerta
            }
        })
        
        res.send(part)
    }

    
}

