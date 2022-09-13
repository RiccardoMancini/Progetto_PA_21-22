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

    public async getAste(){
        return this.modelAsta.getAste();
    }
}