import { DB_Connection } from '../config/db_connection'
import { Asta } from "../models/asta";

const dateCheck = (date:String) => {
    var sData = date.split(' ',3);
    var nData:String = "";

    
        if ((sData[1].length===4)
            && (sData[3].length >=1 && sData[2].length <= 2 && Number(sData[2])<=12 && Number(sData[2])>=1)
            && (sData[3].length >=1 && sData[3].length <= 2 && Number(sData[3])<=31 && Number(sData[2])>=1)){
            var cData:String[]=[sData[3],sData[2],sData[1]];// riordinami la data
            var nData:String=cData.join(' ');
            return nData;
        }
        else{
            throw new TypeError('The credito is not an integer');
        }
    

}
const __Handler = {
    get: (obj, prop) => { 
        if(prop === 'tipo' ){
            if(!Number.isInteger(obj[prop])){
                throw new TypeError("formato dell'asta non valido");
            }

            return obj[prop];
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

            return dateCheck(obj[prop]);
        }
        if(prop ==='data_f' ){
            if (!Number.isInteger(obj[prop])) {
                throw new TypeError('la data non è corretta');
            }

            return obj[prop];
        }    

        if(prop ==='p_min'){
            if ((!Number.isInteger(obj[prop])) && obj[prop]<=0) {
                throw new TypeError('il prezzo di base non è valido');
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

    public async getOpenAstaByID(asta_id: number){
        const asta =  await this.modelAsta.getOpenAstaByID(asta_id);
        return this.checkOpenAsta(asta) === true? asta : console.log('ERRORE: ASTA NON ESISTENTE'); 
    }

    public async getAste(){
        return this.modelAsta.getAste();
    }

    public async createAsta(asta:any){
        // CHECK DELL'OGGETTO ASTA CON PROXY()
        return await this.modelAsta.createAsta(asta);
    }

    public checkOpenAsta(asta: any){
        return asta !== null? true : false;
      }

}