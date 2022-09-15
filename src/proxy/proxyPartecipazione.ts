import { DB_Connection } from '../config/db_connection'
import { Asta } from "../models/asta";
import { Partecipazione } from '../models/partecipazione';

const __Handler = {
    get: (obj, prop) => {                
        
    }
}


export class ProxyPartecipazione{
    modelPartecipazione: any;
    modelAsta: any;
    proxyPartValidator: any;

    constructor(){

      this.modelPartecipazione = new Partecipazione(DB_Connection.getInstance().getConnection());
      this.modelAsta = new Asta(DB_Connection.getInstance().getConnection());

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

    public async getFirstOfferByAstaID(asta_id: number){
      const offer = await this.modelPartecipazione.getFirstOfferByAstaID(asta_id);
      return this.checkOfferExist(offer) === true ? offer : false; 
    }

    public async getOffersByAstaID(asta_id: number){
      return await this.modelPartecipazione.getOffersByAstaID(asta_id);
    }

    public async updatePartecipazione(part: any){
      return await this.modelPartecipazione.updatePartecipazione(part);

    }

    public checkOfferExist(offers: any){
      return offers !== null? true : false;
    }

    

}