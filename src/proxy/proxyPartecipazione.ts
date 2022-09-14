import { DB_Connection } from '../config/db_connection'
import { Asta } from "../models/asta";
import { Partecipazione } from '../models/partecipazione';

const __Handler = {
    get: (obj, prop) => {                
        
        if(prop === 'user_id'){
            if (!Number.isInteger(obj[prop])) {
                throw new TypeError('The user_id is not an integer');
              }
            if (obj[prop] < 1) {
                throw new RangeError('The user_id seems invalid. Choose a number > 0');
              }
            
            return obj[prop];
        } 
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