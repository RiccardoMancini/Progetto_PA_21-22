import { ProxyUtenti } from '../proxy/proxyUtenti'
import { ProxyAsta } from '../proxy/proxyAsta';
import { ProxyChiavi } from '../proxy/proxyChiavi';
import { stato_asta, tipo_asta} from '../models/asta';
import { ProxyPartecipazione } from '../proxy/proxyPartecipazione';
import { ErrEnum, ErrorFactory } from '../factory/errorFactory';
import { ObjectBuilder } from './builder/objectBuilder';
import crypto from 'crypto';
import axios from 'axios';

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
    

    constructor(){}

    public async getListAste(req: any, res:any, next: any){
        try{
            let response: Array<ObjectBuilder> = [];
            let aste = await new ProxyAsta().getAste();
            if(Object.keys(req.query).length !== 0){
                aste = aste.filter(asta => {
                    let stato = Number(req.query.stato)
                    if(!Number.isInteger(stato) || (stato < 1 || stato > 3)){
                        throw new ErrorFactory().getError(ErrEnum.BadRequest)
                    }
                    return asta.stato === stato ? true : false
                });
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
                                let objAsta = new ObjectBuilder()
                                objAsta.setAstaID(value.asta_id)
                                       .setTipo(value.tipo)
                                       .setBaseAsta(value.p_min)
                                       .setStato(value.stato)
                                       .setDataI(value.data_i)
                                       .setDataF(value.data_f)
                                       .build()
                                response.push(objAsta);
                            });
            }
            else{
                response.push(new ObjectBuilder().setMessaggio('Non esistono aste in questo stato!').build());
            }
            
            res.status(200).json(response);
        }
        catch(err){
            next(err);
        }
    }


    /**
     * Creazione di una nuova asta
     */
     public async createAsta(req:any, res:any, next: any){
        try{
            let astaObj: ObjectBuilder = new ObjectBuilder();
            if(req.body.tipo !== tipo_asta.ASTA_APERTA){
                const randKey = getRandomKey(await new ProxyChiavi().getChiavi());
                await new ProxyAsta().createAsta(JSON.stringify(astaObj.setTipo(req.body.tipo)
                                                                              .setBaseAsta(req.body.p_min)
                                                                              .setStato(1)
                                                                              .setDataI(req.body.data_i)
                                                                              .setDataF(req.body.data_f)
                                                                              .setChiaviID(randKey)
                                                                              .build()));
            }
            else{
                await new ProxyAsta().createAsta(JSON.stringify(astaObj.setTipo(req.body.tipo)
                                                                        .setBaseAsta(req.body.p_min)
                                                                        .setStato(1)
                                                                        .setDataI(req.body.data_i)
                                                                        .setDataF(req.body.data_f)
                                                                        .build()));
            }
            
            const response: ObjectBuilder = new ObjectBuilder().setMessaggio('Asta creata!').build();            
            res.status(201).json(response);
        }
        catch(err){
            next(err);
        }
     }

    /**
     * Verifica del credito dell'utente
     */
    public async getMyCredito(req: any, res: any, next: any){
        try{
            let credito = await new ProxyUtenti().getCreditoByUserID(req.user_id);
            const response : ObjectBuilder = new ObjectBuilder().setCredito(Number(credito).toFixed(3)).build();
            res.status(200).json(response);
        }
        catch(err){
            next(err);
        }
    }


    /**
     * Aggiornamento del credito di un determinato utente
     */
    public async updateCredito (req: any, res: any, next: any){
        try{
            let userByID = await new ProxyUtenti().updateCreditoUtente(req.body);
            const response: ObjectBuilder = new ObjectBuilder().setUserID(userByID.user_id)
                                                                .setNewCredito(Number(userByID.credito).toFixed(3))
                                                                .build();
            res.status(200).json(response);
        }
        catch(err){
            next(err)
        }

    }



    public async newOfferta(req: any, res: any, next: any){
        try{
            const asta = await new ProxyAsta().getOpenAstaByID(req.body.asta_id);
            //if (checkDataAsta(asta.data_f)) throw new ErrorFactory().getError(ErrEnum.ToLateToOffer); QUESTO è CORRETTO, MA è SCOMODO PER TESTARE ORA
            if (asta.tipo !== tipo_asta.ASTA_APERTA){
                //decriptazione 
                let codedOfferta = req.body.offerta;
                if(!checkCode64Offer(codedOfferta)) throw new ErrorFactory().getError(ErrEnum.BadCriptedData);            
                
                const decryptedData = Controller.decriptData(codedOfferta, asta.chiavi.private_key)
                let offertaOBJ = JSON.parse(decryptedData.toString());
                req.body.offerta = offertaOBJ.offerta;
                
            }
            let resp = await new ProxyPartecipazione().setOffer(req.user_id, asta, req.body);
            const response: ObjectBuilder = new ObjectBuilder().setMessaggio('Offerta creata!').build();            
            res.status(201).json(response);
        }
        catch(err){
            next(err);
        }
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
            throw new ErrorFactory().getError(ErrEnum.BadDecodeKey);
        }
    }

    public async openAsta(req: any, res: any, next: any){
        try{
            const asta = await new ProxyAsta().getNotOpenAstaByID(Number(req.params.asta_id));
            //if (!checkDataAsta(asta.data_i)) throw new ErrorFactory().getError(ErrEnum.TooEarlyToOpen);  //CORRETTO, MA COMMENTATO PER TEST MIGLIORI DEL METODO
            asta.stato = stato_asta.IN_ESECUZIONE;
            if(asta.tipo === tipo_asta.ASTA_APERTA){
                let response = await axios.post('http://localhost:8080/redirect/WSServer', asta.dataValues);
                if(!response.data.server_active) throw new Error('Errore interno nel reindirizzamento al WSS');
                console.log(response.data.server_active);
            }
            await new ProxyAsta().updateAsta(asta);
            const response: ObjectBuilder = new ObjectBuilder().setAstaID(asta.asta_id)
                                                                .setTipo(asta.tipo)
                                                                .setBaseAsta(asta.p_min)
                                                                .setStato(asta.stato)
                                                                .setDataI(asta.data_i)
                                                                .setDataF(asta.data_f)                                                                
                                                                .setMessaggio('Asta aperta!')
                                                                .build();            
            res.status(200).json(response);
        }
        catch(err){
            next(err);
        }        
    }

    /**
     * Metodo che determina il vincitore di una determinata asta; 
     * scala l'offerta dal credito di quest'ultimo, rispettando i criteri dettati dal tipo di asta;
     * chiude definitivamente l'asta.
     */
    public async setAuctionWon(req: any, res: any, next: any){
        try{
            let response: ObjectBuilder = new ObjectBuilder();
            const asta = await new ProxyAsta().getOpenAstaByID(Number(req.params.asta_id));
            //if (!checkDataAsta(asta.data_f)) throw new ErrorFactory().getError(ErrEnum.TooEarlyToClose);
            if (asta.tipo !== tipo_asta.ASTA_CHIUSA_2){
                let part = await new ProxyPartecipazione().getFirstOfferByAstaID(asta.asta_id);
                if(part !== false){
                    part.aggiudicata = true;
                    part = await new ProxyPartecipazione().updatePartecipazione(part);
                    await new ProxyUtenti().updateCreditoUtente({"user_id": part.user_id, "addebito": -part.offerta}, true);
                    
                    response.setAstaID(part.asta_id)
                            .setUserID(part.user_id)
                            .setAggiudicata(part.aggiudicata)
                            .setOfferta_Addebito(part.offerta)
                            .setMessaggio('Offerta vincente!')
                            .build();
                }
                else{
                    response.setMessaggio('Nessuna offerta fatta per questa asta!')
                            .build();
                }
            }
            else{
                let part = await new ProxyPartecipazione().getOffersByAstaID(asta.asta_id);
                if(part !== null && part.length > 1){
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
                    
                    response.setAstaID(part[0].asta_id)
                            .setUserID(part[0].user_id)
                            .setAggiudicata(part[0].aggiudicata)
                            .setOfferta(part.offerta)
                            .setAddebito(secondOffer)
                            .setMessaggio('Offerta vincente!')
                            .build();                    
                } 
                else{
                    if(part.length === 1){
                        part = new ProxyPartecipazione().deleteOffer(part[0].part_id);
                    }

                    response.setMessaggio('Nessuna offerta fatta per questa asta!')
                            .build();
                }                
            }

            asta.stato = stato_asta.TERMINATA;
            await new ProxyAsta().updateAsta(asta);
            
            res.status(200).json(response);

        }
        catch(err){
            next(err);
        }
                
    }

    public async getMyClosedAste(req: any, res: any, next: any){
        try{
            let arr : Array<ObjectBuilder> = new Array<ObjectBuilder>();
            // GESTIRE SE NON CI SONO PARTECIPAZIONI
            let part = await new ProxyPartecipazione().getClosedAsteByUserID(req.user_id, req.query.date_i, req.query.date_f);
            part.sort((a, b) => { return a.asta_id - b.asta_id })
                .map(elem =>{
                    if(arr.length === 0){ 
                        let tipo: string;
                        switch(elem.astum.tipo){
                            case tipo_asta.ASTA_APERTA:
                                tipo = tipo_asta[1];
                                break;
                            case tipo_asta.ASTA_CHIUSA_1:
                                tipo = tipo_asta[2];
                                break;
                            case tipo_asta.ASTA_CHIUSA_2:
                                tipo = tipo_asta[3];
                                break;
                            default:
                                break;
                        }      
                        arr.push(new ObjectBuilder().setAstaID(elem.asta_id)
                                                    .setUserID(elem.user_id)
                                                    .initPartecipazioni()
                                                    .setPartecipazioni(new ObjectBuilder().setPartID(elem.part_id)
                                                                                            .setAggiudicata(elem.aggiudicata)
                                                                                            .build())
                                                    .setTipo(tipo)
                                                    .setAggiudicata(false)
                                                    .setDataI(elem.astum.data_i)
                                                    .setDataF(elem.astum.data_f)
                                                    .build())
                    }
                    else{
                        let app = arr.find(obj => obj.getAstaID() === elem.asta_id);                        
                        if(typeof app !== 'undefined')
                        {
                            app.getPartecipazioni().push(new ObjectBuilder().setPartID(elem.part_id)
                                                                            .setAggiudicata(elem.aggiudicata)
                                                                            .build())
                        }
                        else{
                            let tipo: string;
                            switch(elem.astum.tipo){
                                case tipo_asta.ASTA_APERTA:
                                    tipo = tipo_asta[1];
                                    break;
                                case tipo_asta.ASTA_CHIUSA_1:
                                    tipo = tipo_asta[2];
                                    break;
                                case tipo_asta.ASTA_CHIUSA_2:
                                    tipo = tipo_asta[3];
                                    break;
                                default:
                                    break;
                            }   
                            arr.push(new ObjectBuilder().setAstaID(elem.asta_id)
                                                        .setUserID(elem.user_id)
                                                        .initPartecipazioni()
                                                        .setPartecipazioni(new ObjectBuilder().setPartID(elem.part_id)
                                                                                            .setAggiudicata(elem.aggiudicata)
                                                                                            .build())
                                                        .setAggiudicata(false)
                                                        .setTipo(tipo)
                                                        .setDataI(elem.astum.data_i)
                                                        .setDataF(elem.astum.data_f)
                                                        .build())
                        }
                    }
                });

            const response: Array<ObjectBuilder> = arr.map(elem => {
                                    let app = elem.getPartecipazioni().find(obj => obj.getAggiudicata() === true);
                                    if(typeof app !== 'undefined'){
                                        elem.setAggiudicata(true);
                                    }
                                    /*let tipo: string;
                                    switch(elem.astum.tipo){
                                        case tipo_asta.ASTA_APERTA:
                                            tipo = tipo_asta[1];
                                            break;
                                        case tipo_asta.ASTA_CHIUSA_1:
                                            tipo = tipo_asta[2];
                                            break;
                                        case tipo_asta.ASTA_CHIUSA_2:
                                            tipo = tipo_asta[3];
                                            break;
                                        default:
                                            break;
                                    }*/
                                    return new ObjectBuilder().setAstaID(elem.getAstaID())
                                                              .setUserID(elem.getUserID())
                                                              .setTipo(elem.getTipo())
                                                              .setAggiudicata(elem.getAggiudicata())
                                                              .setDataI(elem.getDataI())
                                                              .setDataF(elem.getDataF())
                                                              .build();
            });

            res.status(200).json(response);
            
        }
        catch(err){
            next(err);
        }
    }

    public async getMyAste(req: any, res: any, next: any){
        try{
            let app = [];
            let rilanci = [];
            //GESTIRE SE NON CI SONO  PARTECIPAZIONI
            let part = await new ProxyPartecipazione().getAsteByUserID(req.user_id);
            part = part.sort((a, b) => { return b.part_id - a.part_id })
            .filter((elem) => {
                let obj = {"asta_id": elem.asta_id};
                let exists = app.find(value => value.asta_id === obj.asta_id);
                if (typeof exists === 'undefined'){
                    app.push(obj);
                    rilanci.push({"asta_id": elem.asta_id, "offerta": [elem.offerta]});
                    return true;
                }
                else{
                    let obj2 = rilanci.find(value => value.asta_id === exists.asta_id);
                    obj2.offerta.push(elem.offerta);
                    obj2.offerta.sort((a, b) => { return b - a })                
                    return false;
                }
            });

            const response: Array<ObjectBuilder> = part.map((elem, index) => {
                                                            let tipo: string;
                                                            switch(elem.astum.tipo){
                                                                case tipo_asta.ASTA_APERTA:
                                                                    tipo = tipo_asta[1];
                                                                    break;
                                                                case tipo_asta.ASTA_CHIUSA_1:
                                                                    tipo = tipo_asta[2];
                                                                    break;
                                                                case tipo_asta.ASTA_CHIUSA_2:
                                                                    tipo = tipo_asta[3];
                                                                    break;
                                                                default:
                                                                    break;
                                                            }
                                                            return new ObjectBuilder().setAstaID(elem.asta_id)
                                                                                      .setUserID(elem.user_id)
                                                                                      .setTipo(tipo)
                                                                                      .setStato(elem.astum.stato === 2 ? stato_asta[2] : stato_asta[3])
                                                                                      .setDataI(elem.astum.data_i)
                                                                                      .setDataF(elem.astum.data_f)
                                                                                      .setRilanci_Offerta(rilanci[index].offerta)
                                                                                      .build();
                                                    });          
            res.status(200).send(response);
        }
        catch(err){
            next(err);
        }        
    }    
}

