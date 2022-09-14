import { DB_Connection } from '../config/db_connection'
import { Asta } from "../models/asta";

const __Handler = {
    get: (obj, prop) => { 
        if(prop === 'tipo' ){
            if(!Number.isInteger(obj[prop])){
                throw new TypeError("formato dell'asta non valido");
            }
        }

        if(prop ==='data_i' ){        
            if (!Number.isInteger(obj[prop])&& (Date.now()>obj[prop])
                                            && (obj['data_i']) >= obj['data_f']
                                            && (obj['tipo']===1)) {
                throw new TypeError('la data non è corretta');
            }
            else if(!Number.isInteger(obj[prop])&&(obj['tipo']!==1) 
                                                && (Date.now()>obj[prop])
                                                && (obj['data_i']) >= obj['data_f']){
                throw new TypeError('la data non è corretta')

            }
        }
        if(prop ==='data_f' ){
            if (!Number.isInteger(obj[prop])) {
                throw new TypeError('la data non è corretta');
            }
        }    

        if(prop ==='p_min'){
            if ((!Number.isInteger(obj[prop])) && obj[prop]<=0) {
                throw new TypeError('il prezzo di base non è valido');
            }

        }
    }              
}


export class ProxyAsta{
    modelAsta: any;
    proxyAstaValidator: any;

    constructor(){

        this.modelAsta = new Asta(DB_Connection.getInstance().getConnection());

    }

    public async getAste(){
        return this.modelAsta.getAste();
    }

    // metodo che scrive la data nel modo corretto per Timestamp

    public converterData(data:String){
        var sData = data.split(' ',3);
        var nData:String = "";

        if ((sData[1].length!==4)
            && (sData[2].length>2 && Number(sData[2])>12 && Number(sData[2])<1)
            && (sData[3].length>2 && Number(sData[3])>31 && Number(sData[2])<1)){
            var cData:String[]=[sData[3],sData[2],sData[1]];
            var nData:String=cData.join(' ');
            return nData;
        }

    }
}