import { DB_Connection } from '../config/db_connection'
import { Asta, tipo_asta } from "../models/asta";
import { ErrEnum, ErrorFactory } from '../factory/errorFactory';
import { ObjectBuilder } from '../controllers/builder/objectBuilder';
import { AstaInterface } from '../models/interface/astaInterface';

function checkTime(time: string): Array<string> | boolean{
    const re = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;
    if(re.test(time) && time.includes(':')){
        return time.split(':');
    }
    else{
        return false;
    }

}

function datesAreOnSameDay(first, second){
    return (first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate());
}

export function checkDate(date: string): Date | boolean{
    //const re = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
    const re1 = /^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}$/;
    const re2 = /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/;
    //console.log(re1.test(date), re2.test(date))
    if((re1.test(date) || re2.test(date))){        
        //Test which seperator is used '/' or '-'
        let opera1 = date.split('/');
        let opera2 = date.split('-');
        let lopera1 = opera1.length;
        let lopera2 = opera2.length;
        //console.log(lopera1, lopera2)
        // Extract the string into month, date and year
        if (lopera1>1){
            var pdate = date.split('/');
        }
        else if (lopera2>1){
            var pdate = date.split('-');
        }
        //console.log(pdate)
        if(re1.test(date)){
            //console.log(pdate)
            var dd = parseInt(pdate[0]);
            var yy = parseInt(pdate[2]);
        }
        else{
            //console.log(pdate)
            var dd = parseInt(pdate[2]);
            var yy = parseInt(pdate[0]);
        }
        
        var mm  = parseInt(pdate[1]);
        
        // Create list of days of a month [assume there is no leap year by default]
        var ListofDays = [31,28,31,30,31,30,31,31,30,31,30,31];
        if (mm === 1 || mm > 2){
            if (dd > ListofDays[mm - 1]){
                return false;
            }
        }
        if (mm == 2){
        var lyear = false;
            if ( (!(yy % 4) && yy % 100) || !(yy % 400)){
                lyear = true;
            }
            if ((lyear==false) && (dd >= 29)){
                return false;
            }
            if ((lyear==true) && (dd > 29)){
                return false;
            }
        }
        return new Date(yy, mm-1, dd);
    }
    else{
        return false;
    }

}

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
            if ((!Number(obj[prop])) && obj[prop]<=0) {
                throw new ErrorFactory().getError(ErrEnum.BadFormattedData);
            }

            return obj[prop];

        }

    }              
}


export class ProxyAsta implements AstaInterface{
    modelAsta: Asta;
    proxyAstaValidator: any;

    constructor(){

        this.modelAsta = new Asta(DB_Connection.getInstance().getConnection());

    }

    public async getNotOpenAstaByID(asta_id: number): Promise<any|null>{
        this.proxyAstaValidator = new Proxy({"asta_id": asta_id}, proxyAstaHandler)
        const val_asta_id = this.proxyAstaValidator.asta_id;
        const asta =  await this.modelAsta.getNotOpenAstaByID(val_asta_id);
        if(this.checkAsta(asta)){
            return asta;
        }
        else{
            throw new ErrorFactory().getError(ErrEnum.AstaNotFound);
        }
    }

    public async getOpenAstaByID(asta_id: number): Promise<any|null>{
        this.proxyAstaValidator = new Proxy({"asta_id": asta_id}, proxyAstaHandler)
        const val_asta_id = this.proxyAstaValidator.asta_id;
        const asta =  await this.modelAsta.getOpenAstaByID(val_asta_id);
        if(this.checkAsta(asta)){
            return asta;
        }
        else{
            throw new ErrorFactory().getError(ErrEnum.AstaNotFound);
        }
    }

    public async getAste(): Promise<Array<any>>{
        return this.modelAsta.getAste();
    }

    public async updateAsta(asta: any): Promise<any>{
        return await this.modelAsta.updateAsta(asta);
    }

    public async createAsta(asta: string): Promise<any>{
        let astaJson = JSON.parse(asta);
        this.proxyAstaValidator = new Proxy(astaJson, proxyAstaHandler);
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

    public checkAsta(asta: any): boolean{
        return asta !== null? true : false;
    }

}