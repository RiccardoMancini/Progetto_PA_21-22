import { ProxyUtenti } from '../proxy/proxyUtenti'
import { ProxyAsta } from '../proxy/proxyAsta';
import { ProxyChiavi } from '../proxy/proxyChiavi';
import { stato_asta, tipo_asta} from '../models/asta';
import { ProxyPartecipazione } from '../proxy/proxyPartecipazione';

function getRandomKey(rawKeys: any){    
    const arrKey = rawKeys.map(elem => elem.chiavi_id)
    let indice = Math.round(Math.random() * (arrKey.length - 1));
    return arrKey[indice];
}

export class Controller {

    /*public async getListUsers(req: any, res:any){
        const users = await new ProxyUtenti().getUtenti();

        res.send(users);
    }*/


    public async getListAste(req: any, res:any){
        let aste = await new ProxyAsta().getAste();

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

    /*public async getListPartecipazioni(req: any, res: any){
        let part = await new Partecipazione().getPartecipazioni()

        res.send(part);
    }*/


    /**
     * Creazione di una nuova asta
     */
     public async createAsta( req:any, res:any){
        let randKey = getRandomKey(await new ProxyChiavi().getChiavi());        
        let newAsta = await new ProxyAsta().createAsta({"tipo":req.body.tipo,
                                            "p_min":req.body.p_min,
                                            "stato":1,
                                            "data_i":"2022-04-12",    
                                            "data_f":"2022-04-12", 
                                            "chiavi_id":randKey });
        
        
        res.send(newAsta);

     }

    /**
     * Verifica del credito dell'utente
     */
    public async getMyCredito(req: any, res: any){
        let credito = await new ProxyUtenti().getCreditoByUserID(req.user_id);
        res.send({"credito": credito});
    }


    /**
     * Aggiornamento del credito di un determinato utente
     */
    public async updateCredito (req: any, res: any){
        let userByID = await new ProxyUtenti().updateCreditoUtente(req.body);
        res.send({ "user_id": userByID.user_id, "new_credito": userByID.credito });
    }


    public async setAuctionWon(req: any, res: any){
        const asta = await new ProxyAsta().getOpenAstaByID(req.params.asta_id);

        //if asta.tipo !== tipoaste.Bustachiusasecondascelta (getFirstOffer())
        const part = await new ProxyPartecipazione().getOffersByAstaID(asta.asta_id);

        //else (getSecondOffer and the winner)


        //update aggiudicata in True,

        //update il credito del concorrente corrispondente

        res.send(part)
    }

    public async getMyClosedAste(req: any, res: any){
        /*const date_obj_i = new Date(Number(req.query.date_i));
        const date_obj_f = new Date(Number(req.query.date_f));*/
        let part = await new ProxyPartecipazione().getClosedAsteByUserID(req.user_id);
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
        let part = await new ProxyPartecipazione().getAsteByUserID(req.user_id);
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

