import { DB_Connection } from '../config/db_connection'
import { Asta, tipo_asta } from "../models/asta";
import { Partecipazione } from '../models/partecipazione';
import { Utenti } from '../models/utenti';

const __Handler = {
  get: (obj, prop) => { 
      if(prop === 'offerta' ){
        if (!Number(obj[prop])) { //sbagliato perche mi sa che converte!!
          throw new TypeError('The offerta is not a number');
        }
        if (obj[prop] < 1) {
          throw new RangeError('The credito seems invalid. Choose a number > 0');
        }
      
      return obj[prop];
    }

} 
}


export class ProxyPartecipazione{
    modelPartecipazione: any;
    modelAsta: any;
    modelUtenti: any
    proxyPartValidator: any;

    constructor(){

      this.modelPartecipazione = new Partecipazione(DB_Connection.getInstance().getConnection());
      this.modelAsta = new Asta(DB_Connection.getInstance().getConnection());
      this.modelUtenti = new Utenti(DB_Connection.getInstance().getConnection());

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

    public async setOffer(user_id: number, asta: any, payload: any){
      let val_offerta: number;
      this.proxyPartValidator = new Proxy(payload, __Handler);
      val_offerta = this.proxyPartValidator.offerta;

      let offerYet = await this.getOffersByUserAstaID(user_id, asta.asta_id);
      if(asta.tipo !== tipo_asta.ASTA_APERTA && offerYet !== null){
        throw new Error("ERROR: L'ASTA IN BUSTA CHIUSA PREVEDE SOLO UN'OFFERTA")
      }
      else{
        let isExist = offerYet.filter(elem => elem.offerta === val_offerta || elem.offerta > val_offerta);
        if(isExist.length !== 0){
          throw new Error("ERROR: OFFERTA GIA' FATTA");
        }

      }
      
      if(await this.checkIfValidOffer(user_id, asta.p_min, val_offerta)){

        return this.modelPartecipazione.setOffer({"user_id": user_id, "asta_id": payload.asta_id, "aggiudicata": false, "offerta": val_offerta})

      }
      else{
        throw new Error("ERROR: CREDITO O OFFERTA NON SUFFICIENTE!")
      }

    }

    public async getOffersByUserAstaID(user_id: number, asta_id:number){
      return await this.modelPartecipazione.getOffersByUserAstaID(user_id, asta_id);
      
    }



    public async checkIfValidOffer(user_id: number, base_asta: number, offerta: number){
      let credito = await this.modelUtenti.getCreditoByUserID(user_id).then(value => value.credito);
      return (credito - offerta >= 0 && offerta > base_asta) ? true : false;

    }
    
    

    public checkOfferExist(offers: any){
      return offers !== null? true : false;
    }

    

}