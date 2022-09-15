import { DB_Connection } from '../config/db_connection'
import { Asta } from "../models/asta";

const __Handler = {
    get: (obj, prop) => {                
        
        /**
         * DA FARE
         */
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

    public checkOpenAsta(asta: any){
        return asta !== null? true : false;
      }

}