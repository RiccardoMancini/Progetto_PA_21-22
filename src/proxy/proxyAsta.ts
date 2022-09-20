import { DB_Connection } from '../config/db_connection'
import { Asta, tipo_asta } from "../models/asta";
import { ErrEnum, ErrorFactory } from '../factory/errorFactory';

function checkDate(date): boolean{
    //const re = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
    const re1 = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    const re2 = /^\d{4}\/\d{1,2}\/\d{1,2}$/;
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
        return true;
    }
    else{
        return false;
    }

}

const __Handler = {
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
            //get local time
            var d = new Date();
            var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
            var nd = new Date(utc + (3600000 * 2));
            if (typeof obj[prop] === 'string' && checkDate(obj[prop]) && checkDate(obj['data_f'])){
                const date_i = new Date(obj[prop]);
                const date_f = new Date(obj['data_f']);                
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
            return new Date(obj[prop]);
        }    

        if(prop ==='p_min'){
            if ((!Number(obj[prop])) && obj[prop]<=0) {
                throw new ErrorFactory().getError(ErrEnum.BadFormattedData);
            }

            return obj[prop];

        }

    }              
}


export class ProxyAsta{
    modelAsta: any;
    proxyAstaValidator: any;

    constructor(){

        this.modelAsta = new Asta(DB_Connection.getInstance().getConnection());

    }

    public async getNotOpenAstaByID(asta_id: number){
        this.proxyAstaValidator = new Proxy({"asta_id": asta_id}, __Handler)
        const val_asta_id = this.proxyAstaValidator.asta_id;
        const asta =  await this.modelAsta.getNotOpenAstaByID(val_asta_id);
        if(this.checkAsta(asta)){
            return asta;
        }
        else{
            throw new ErrorFactory().getError(ErrEnum.AstaNotFound);
        }
    }

    public async getOpenAstaByID(asta_id: number){
        this.proxyAstaValidator = new Proxy({"asta_id": asta_id}, __Handler)
        const val_asta_id = this.proxyAstaValidator.asta_id;
        const asta =  await this.modelAsta.getOpenAstaByID(val_asta_id);
        if(this.checkAsta(asta)){
            return asta;
        }
        else{
            throw new ErrorFactory().getError(ErrEnum.AstaNotFound);
        }
    }

    public async getAste(){
        return this.modelAsta.getAste();
    }

    public async updateAsta(asta: any){
        return await this.modelAsta.updateAsta(asta);
    }

    public async createAsta(asta:any){
        this.proxyAstaValidator = new Proxy(asta, __Handler);
        let val_tipo: number = this.proxyAstaValidator.tipo;
        let val_p_min: number = this.proxyAstaValidator.p_min;
        //console.log(val_tipo, val_p_min);
        let val_date_i = this.proxyAstaValidator.data_i;
        let val_date_f = this.proxyAstaValidator.data_f;
        //console.log(val_date_i, val_date_f)
        //console.log(checkDate(asta.data_i));
        /*let app = val_date_i.setTime(val_date_i.getTime() + 1000 * 60);
        console.log(new Date(app).toISOString());*/
        if(val_tipo !== tipo_asta.ASTA_APERTA){
            return await this.modelAsta.createAsta({"tipo": val_tipo,
                                                "p_min": val_p_min,
                                                "stato": 1,
                                                "data_i": val_date_i,    
                                                "data_f": val_date_f, 
                                                "chiavi_id": asta.chiavi_id });
        }
        else{
            return await this.modelAsta.createAsta({"tipo": val_tipo,
                                                "p_min": val_p_min,
                                                "stato": 1,
                                                "data_i": val_date_i,    
                                                "data_f": val_date_f});
        }
        
    }

    public checkAsta(asta: any){
        return asta !== null? true : false;
    }

}