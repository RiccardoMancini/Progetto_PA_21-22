import { DB_Connection } from '../config/db_connection'
import { ErrEnum, ErrorFactory } from '../factory/errorFactory';
import { Asta, tipo_asta } from "../models/asta";
import { Partecipazione } from '../models/partecipazione';
import { Utenti } from '../models/utenti';

const __Handler = {
  get: (obj, prop) => { 
      if(prop === 'offerta' ){
        if (Number.isNaN(obj[prop])) {
          throw new ErrorFactory().getError(ErrEnum.BadFormattedData);
        }
        if (obj[prop] < 1) {
          throw new ErrorFactory().getError(ErrEnum.BadFormattedData);
        }
      
      return obj[prop];
    }
    if(prop === 'user_id'){
      if (!Number.isInteger(obj[prop])) {
          throw new ErrorFactory().getError(ErrEnum.BadFormattedData);
        }
      if (obj[prop] < 1) {
          throw new ErrorFactory().getError(ErrEnum.BadFormattedData);
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
      this.proxyPartValidator = new Proxy({"user_id": user_id}, __Handler);
      const val_user_id: number = this.proxyPartValidator.user_id;
      let partecipazioni = await this.modelPartecipazione.getClosedAsteByUserID(val_user_id);  
      return partecipazioni;
  
    }
    
    public async getAsteByUserID(user_id: number){
      this.proxyPartValidator = new Proxy({"user_id": user_id}, __Handler);
      const val_user_id: number = this.proxyPartValidator.user_id;
      let partecipazioni = await this.modelPartecipazione.getAsteByUserID(val_user_id);
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
        throw new ErrorFactory().getError(ErrEnum.OfferAlreadyExist);
      }
      else{
        let isExist = offerYet.filter(elem => elem.offerta === val_offerta || elem.offerta > val_offerta);
        if(isExist.length !== 0){
          throw new ErrorFactory().getError(ErrEnum.TooLowOfferOrCredit);
        }

      }
      
      if(await this.checkIfValidOffer(user_id, asta.p_min, val_offerta)){

        return this.modelPartecipazione.setOffer({"user_id": user_id, "asta_id": payload.asta_id, "aggiudicata": false, "offerta": val_offerta})

      }
      else{
        throw new ErrorFactory().getError(ErrEnum.TooLowOfferOrCredit);
      }

    }

    public async deleteOffer(part_id: number){
      return await this.modelPartecipazione.deleteOffer(part_id);
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