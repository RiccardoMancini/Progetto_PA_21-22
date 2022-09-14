import { DB_Connection } from '../config/db_connection'
import { Asta } from "../models/asta";
import { Partecipazione } from '../models/partecipazione';

const __Handler = {
    get: (obj, prop) => {                
        
    }
}


export class ProxyPartecipazione{
    modelPartecipazione: any;
    proxyPartValidator: any;

    constructor(){

        this.modelPartecipazione = new Partecipazione(DB_Connection.getInstance().getConnection());

    }

    public async getClosedAsteByUserID(user_id: number){
        //CHECK DATA
        let partecipazioni = await this.modelPartecipazione.getClosedAsteByUserID(user_id);  
        return partecipazioni;
  
      }
    
      public async getAsteByUserID(user_id: number){
        let partecipazioni = await this.modelPartecipazione.getAsteByUserID(user_id);
        return partecipazioni;
        
      }

}