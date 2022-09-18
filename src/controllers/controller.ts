import { ProxyUtenti } from '../proxy/proxyUtenti'
import { ProxyAsta } from '../proxy/proxyAsta';
import { ProxyChiavi } from '../proxy/proxyChiavi';
import { stato_asta, tipo_asta} from '../models/asta';
import { ProxyPartecipazione } from '../proxy/proxyPartecipazione';
import crypto from 'crypto';

function getRandomKey(rawKeys: any){    
    const arrKey = rawKeys.map(elem => elem.chiavi_id)
    let indice = Math.round(Math.random() * (arrKey.length - 1));
    return arrKey[indice];
}

function checkDataAsta(data: Date){
    const now = new Date(Date.now());
    console.log(now.toISOString(), data, now > data)
    return now > data ? true : false
}

function checkCode64Offer(offerCripted: string){
    const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    return base64regex.test(offerCripted) ? true : false;

}

export class Controller {

    private static readonly headerPrivateKey: string = '-----BEGIN PRIVATE KEY-----\n';
    private static readonly footerPrivateKey: string = '\n-----END PRIVATE KEY-----';

    constructor(){
    }

    public async getListAste(req: any, res:any){
        let aste = await new ProxyAsta().getAste();

        if(Object.keys(req.query).length !== 0){
            aste = aste.filter(asta => asta.stato === Number(req.query.stato));
        }

        if(aste.length !== 0)
        {
            aste.map((value: any) => {
                            switch (value.tipo){

                                case tipo_asta.ASTA_APERTA:
                                    value.tipo = tipo_asta[1];
                                    break;
                                case tipo_asta.ASTA_CHIUSA_1:
                                    value.tipo = tipo_asta[2];
                                    break;
                                case tipo_asta.ASTA_CHIUSA_2:
                                    value.tipo = tipo_asta[3];
                                    break;
                                default:
                                    break;
                            }
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


    /**
     * Creazione di una nuova asta
     */
     public async createAsta( req:any, res:any){
        let newAsta: any;
        if(req.body.tipo !== tipo_asta.ASTA_APERTA){
            const randKey = getRandomKey(await new ProxyChiavi().getChiavi());
            newAsta = await new ProxyAsta().createAsta({"tipo":req.body.tipo,
                                                "p_min":req.body.p_min,
                                                "stato":1,
                                                "data_i":"2022-04-12",    
                                                "data_f":"2022-04-12", 
                                                "chiavi_id":randKey });

        }
        else{
            newAsta = await new ProxyAsta().createAsta({"tipo":req.body.tipo,
                                                "p_min":req.body.p_min,
                                                "stato":1,
                                                "data_i":"2022-04-12",    
                                                "data_f":"2022-04-12"});

        } 
        
        
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

    



    public async newOfferta(req: any, res: any){
        let offerta: number;
        const asta = await new ProxyAsta().getOpenAstaByID(req.body.asta_id);
        //if (checkDataAsta(asta.data_f)) console.log("ERROR: E' troppo tardi per fare un'offerta!"); QUESTO è CORRETTO, MA è SCOMODO PER TESTARE ORA
        if (asta.tipo !== tipo_asta.ASTA_APERTA){
            //decriptazione 
            let codedOfferta = req.body.offerta;
            if(!checkCode64Offer(codedOfferta)) throw Error('ERROR: FORMATO BASE64 NON VALIDO!');            
            
            const decryptedData = Controller.decriptData(codedOfferta, asta.chiavi.private_key)
            let offertaOBJ = JSON.parse(decryptedData.toString());
            req.body.offerta = offertaOBJ.offerta;
            
        }

        let resp = await new ProxyPartecipazione().setOffer(req.user_id, asta, req.body);       


        res.send(resp)



    }

    private static decriptData(codedData: string, private_key: string){
        try{
            return crypto.privateDecrypt(
                {
                  key: Controller.headerPrivateKey + private_key + Controller.footerPrivateKey,
                  padding: crypto.constants.RSA_PKCS1_PADDING
                },
                Buffer.from(codedData, 'base64')
              );

        }
        catch(err){
            throw new Error("Errore di decodifica!");
        }
    }

    public async openAsta(req: any, res: any){
        const asta = await new ProxyAsta().getNotOpenAstaByID(Number(req.params.asta_id));
        //if (!checkDataAsta(asta.data_i)) console.log("ERROR: Non si può ancora chiudere l'asta!");  //CORRETTO, MA COMMENTATO PER TEST MIGLIORI DEL METODO
        asta.stato = stato_asta.IN_ESECUZIONE;
        if(asta.tipo === tipo_asta.ASTA_APERTA){
            //createWSS() || una rotta con axios che crea il websocket
        }
        await new ProxyAsta().updateAsta(asta);
        let response = {"asta_id": asta.asta_id, "stato": asta.stato};

        res.send(response);
    }

    /**
     * Metodo che determina il vincitore di una determinata asta; 
     * scala l'offerta dal credito di quest'ultimo, rispettando i criteri dettati dal tipo di asta;
     * chiude definitivamente l'asta.
     */
    public async setAuctionWon(req: any, res: any){
        let response = {}
        const asta = await new ProxyAsta().getOpenAstaByID(Number(req.params.asta_id));
        if (!checkDataAsta(asta.data_f)) console.log("ERROR: Non si può ancora chiudere l'asta!");

        if (asta.tipo !== tipo_asta.ASTA_CHIUSA_2){
            let part = await new ProxyPartecipazione().getFirstOfferByAstaID(asta.asta_id);
            if(part !== false){
                part.aggiudicata = true;
                part = await new ProxyPartecipazione().updatePartecipazione(part);
                await new ProxyUtenti().updateCreditoUtente({"user_id": part.user_id, "addebito": -part.offerta}, true);
                
                asta.stato = stato_asta.TERMINATA;
                await new ProxyAsta().updateAsta(asta);
                response = {"asta_id": part.asta_id, "user_id": part.user_id, "aggiudicata": part.aggiudicata, "offerta / addebito": part.offerta};
            }
            else{

                response = {"info": "Nessuna offerta fatta per questa asta!"}
            }
        }
        else{
            let part = await new ProxyPartecipazione().getOffersByAstaID(asta.asta_id);
            if(part !== false && part.length > 1){
                let secondOffer = part.map(elem => elem.offerta).filter((elem, index) => index < 1 ? false : true)[0];
                
                part = await Promise.all(part.map(async (elem, index) => {
                    if (index === 0){
                        elem.aggiudicata = true;
                        elem = await new ProxyPartecipazione().updatePartecipazione(elem);                     
                    }
                    return elem
                    
                })
                .filter((elem, index) => index<1 ? true : false));               
                
                await new ProxyUtenti().updateCreditoUtente({"user_id": part[0].user_id, "addebito": -secondOffer}, true);

                asta.stato = stato_asta.TERMINATA;
                await new ProxyAsta().updateAsta(asta);                
                response = {"asta_id": part[0].asta_id, "user_id": part[0].user_id, "aggiudicata": part[0].aggiudicata, "offerta": part[0].offerta, "addebito": secondOffer};
                
            } 
            else{
                //if(part.length === 1) Cancellare la prenotazione e chiudere l'asta.

                response = {"info": "Nessuna offerta fatta per questa asta!"}
            }
            
        }
        
        res.send(response);     

        
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
                "stato": elem.astum.stato === 2 ? stato_asta[2]:stato_asta[3],
                "rilanci / offerta": rilanci[index].offerta
            }
        })
        
        res.send(part)
    }

    
}

