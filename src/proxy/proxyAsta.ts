import { DB_Connection } from '../config/db_connection'
import { Asta, tipo_asta } from "../models/asta";
import { ErrEnum, ErrorFactory } from '../factory/errorFactory';
import { ObjectBuilder } from '../controllers/builder/objectBuilder';
import { AstaInterface } from '../models/interface/astaInterface';
import { checkTime, datesAreOnSameDay, checkDate } from '../utils/functions';


// Oggetto che viene passato come handler dell'oggetto proxy
const proxyAstaHandler = {
    get: (obj, prop) => { 
        if(prop === 'asta_id'){
            if(!Number.isInteger(obj[prop])){
                throw new ErrorFactory().getError(ErrEnum.BadFormattedData);
            }
            if(obj[prop] < 1){
                throw new ErrorFactory().getError(ErrEnum.BadFormattedData);
            }

            return obj[prop];
            
            
        }
        if(prop === 'tipo'){
            if(!Number.isInteger(obj[prop])){
                throw new ErrorFactory().getError(ErrEnum.BadFormattedData);
            }
            if(!(obj[prop] >=1 && obj[prop]<=3)){
                throw new ErrorFactory().getError(ErrEnum.BadFormattedData);
            }

            return obj[prop];
        }

        if(prop ==='data_i'){
            if (typeof obj[prop] === 'undefined' || typeof obj['data_f'] === 'undefined' || typeof obj[prop] !== 'string' || typeof obj['data_f'] !== 'string'){              
                throw new ErrorFactory().getError(ErrEnum.BadRequest);
            }
            
            const split_datetime_i = obj[prop].trim().split(/\s+/);
            let date_i: any = split_datetime_i[0];
            let time_i: string = split_datetime_i[1];
            date_i = checkDate(date_i);
            const split_datetime_f = obj['data_f'].trim().split(/\s+/);
            let date_f: any = split_datetime_f[0];
            let time_f: string = split_datetime_f[1];
            
            date_f = checkDate(date_f);
            if(typeof time_i !== 'undefined'){
                if(date_i !== false && checkTime(time_i)){             
                    date_i.setHours(Number(checkTime(time_i)[0]), Number(checkTime(time_i)[1]), 0);
                }
                else{
                    throw new ErrorFactory().getError(ErrEnum.InvalidDate);
                }
            }
            if(typeof time_f !== 'undefined'){
                if(date_f !== false && checkTime(time_f)){               
                    date_f.setHours(Number(checkTime(time_f)[0]), Number(checkTime(time_f)[1]), 0);
                }
                else{
                    throw new ErrorFactory().getError(ErrEnum.InvalidDate);
                }       
            }

            //console.log(date_i, date_f, date_i>date_f);
            var d = new Date();
            var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
            var nd = new Date(utc + (3600000 * 2));
            if (date_i && date_f){              
                if((nd > date_i) || (date_i >= date_f)){                    
                    throw new ErrorFactory().getError(ErrEnum.InvalidDate);
                }
                return date_i;
            }
            else{                
                throw new ErrorFactory().getError(ErrEnum.InvalidDate);
            }

            
        }
        if(prop === 'data_f'){
            const split_datetime_i = obj['data_i'].trim().split(/\s+/);
            let date_i: any = split_datetime_i[0];
            let time_i: string = split_datetime_i[1];
            date_i = checkDate(date_i);
            const split_datetime_f = obj[prop].trim().split(/\s+/);
            let date_f: any = split_datetime_f[0];
            let time_f: string = split_datetime_f[1];
            
            date_f = checkDate(date_f);
            if(typeof time_i !== 'undefined'){
                if(date_i !== false && checkTime(time_i)){             
                    date_i.setHours(Number(checkTime(time_i)[0]), Number(checkTime(time_i)[1]), 0);
                }
                else{
                    throw new ErrorFactory().getError(ErrEnum.InvalidDate);
                }
            }
            if(typeof time_f !== 'undefined'){
                if(date_f !== false && checkTime(time_f)){               
                    date_f.setHours(Number(checkTime(time_f)[0]), Number(checkTime(time_f)[1]), 0);
                }
                else{
                    throw new ErrorFactory().getError(ErrEnum.InvalidDate);
                }       
            }
            if(obj['tipo'] === 1)
            {
                //console.log(datesAreOnSameDay(date_i, date_f))
                if(!datesAreOnSameDay(date_i, date_f)) throw new ErrorFactory().getError(ErrEnum.InvalidDate);
            }

            return date_f
        }    

        if(prop ==='p_min'){
            if (isNaN(obj[prop]) || obj[prop]<=0) {
                throw new ErrorFactory().getError(ErrEnum.BadFormattedData);
            }
            return obj[prop];
        }
    }              
}

// Classe proxy corrispondente al modello Asta
export class ProxyAsta implements AstaInterface{
    modelAsta: Asta;
    proxyAstaValidator: any;

    constructor(){
        this.modelAsta = new Asta(DB_Connection.getInstance().getConnection());
    }

    /**
     * Metodo che ricerca un'asta non aperta
     * @param asta_id id dell'asta da cercare
     * @returns l'oggetto rappresentante l'asta estratta
     */
    public async getNotOpenAstaByID(asta_id: number): Promise<any|null>{
        this.proxyAstaValidator = new Proxy({"asta_id": asta_id}, proxyAstaHandler);
        // validazione id asta e check della sua esistenza
        const val_asta_id = this.proxyAstaValidator.asta_id;
        const asta: any =  await this.modelAsta.getNotOpenAstaByID(val_asta_id);
        if(this.checkAsta(asta)){
            return asta;
        }
        else{
            throw new ErrorFactory().getError(ErrEnum.AstaNotFound);
        }
    }

    /**
     * Metodo che ricerca un'asta aperta
     * @param asta_id id dell'asta da cercare
     * @returns l'oggetto rappresentante l'asta estratta
     */
    public async getOpenAstaByID(asta_id: number): Promise<any|null>{
        this.proxyAstaValidator = new Proxy({"asta_id": asta_id}, proxyAstaHandler);
        // validazione id asta e check della sua esistenza
        const val_asta_id = this.proxyAstaValidator.asta_id;
        const asta =  await this.modelAsta.getOpenAstaByID(val_asta_id);
        if(this.checkAsta(asta)){
            return asta;
        }
        else{
            throw new ErrorFactory().getError(ErrEnum.AstaNotFound);
        }
    }

    /**
     * Metodo che seleziona tutte le aste esistenti nel db
     * @returns un'array di oggetti rappresentanti le aste
     */
    public async getAste(): Promise<Array<any>>{
        return this.modelAsta.getAste();
    }

    /**
     * Metodo che permette l'update di un'asta
     * @param asta oggetto asta da aggiornare nel db
     * @returns l'asta aggiornata
     */
    public async updateAsta(asta: any): Promise<any>{
        return await this.modelAsta.updateAsta(asta);
    }

    /**
     * Metodo che crea una nuova asta
     * @param asta stringa che costituisce l'asta da creare
     * @returns l'asta creata
     */
    public async createAsta(asta: string): Promise<any>{
        let astaJson = JSON.parse(asta);
        this.proxyAstaValidator = new Proxy(astaJson, proxyAstaHandler);
        // validazione dei parametri dell'asta
        let val_tipo: number = this.proxyAstaValidator.tipo;
        let val_p_min: number = this.proxyAstaValidator.p_min;
        let val_date_i = this.proxyAstaValidator.data_i;
        let val_date_f = this.proxyAstaValidator.data_f;
        if(val_tipo !== tipo_asta.ASTA_APERTA){
            return await this.modelAsta.createAsta(JSON.stringify(
                                                    new ObjectBuilder().setTipo(val_tipo)
                                                                        .setBaseAsta(val_p_min)
                                                                        .setStato(1)
                                                                        .setDataI(val_date_i)
                                                                        .setDataF(val_date_f)
                                                                        .setChiaviID(astaJson.chiavi_id)
                                                                        .build()));
                                                
        }
        else{
            return await this.modelAsta.createAsta(JSON.stringify(
                                                    new ObjectBuilder().setTipo(val_tipo)
                                                                        .setBaseAsta(val_p_min)
                                                                        .setStato(1)
                                                                        .setDataI(val_date_i)
                                                                        .setDataF(val_date_f)
                                                                        .build()));
        }
    }
    /**
     * @param asta 
     * @returns 
     */
    public checkAsta(asta: any): boolean{
        return asta !== null? true : false;
    }

}