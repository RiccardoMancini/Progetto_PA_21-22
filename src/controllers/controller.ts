import { Utenti } from '../models/utenti'
import { Asta, stato_asta, tipo_asta} from '../models/asta';
import { Partecipazione } from '../models/partecipazione';
import { Chiavi } from '../models/chiavi';

export class Controller {

    public async getListUsers(req: any, res:any){
        const users = await new Utenti().getUtenti();

        res.send(users);
    }

    public async getChiavi(req: any, res:any){
        const chiavi = await new Chiavi().getModelChiavi();

        res.send(chiavi);
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

     public async generaAsta( req:any, res:any){
        let chiaviModel = new Chiavi();
        let max = await chiaviModel.getModelChiavi().count();
        let keyID = Math.round(Math.random() * (max - 1) + 1);

        let newAsta = await new Asta().createAsta({"tipo":req.body.tipo,
                                            "p_min":req.body.p_min,
                                            "stato":1,
                                            "data_i":"2022-04-12",    
                                            "data_f":"2022-04-12", 
                                            "chiavi_id":keyID });
        
        res.send(newAsta);

     }


    
}

