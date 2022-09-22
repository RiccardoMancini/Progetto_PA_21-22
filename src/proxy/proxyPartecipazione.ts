import { DB_Connection } from '../config/db_connection'
import { ObjectBuilder } from '../controllers/builder/objectBuilder';
import { ErrEnum, ErrorFactory } from '../factory/errorFactory';
import { Asta, tipo_asta } from "../models/asta";
import { PartecipazioneInterface } from '../models/interface/partecipazioneInterface';
import { Partecipazione } from '../models/partecipazione';
import { Utenti } from '../models/utenti';
import { checkDate } from './proxyAsta';

const proxyPartHandler = {
  get: (obj, prop) => { 
      if(prop === 'offerta' ){
        if (isNaN(obj[prop])) {
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
    if(prop ==='data_i'){
      if (typeof obj[prop] !== 'string' || typeof obj['data_f'] !== 'string'){              
        throw new ErrorFactory().getError(ErrEnum.InvalidDate);
      }
      const date_i: any = checkDate(obj[prop]);
      const date_f: any = checkDate(obj['data_f']);
      
      if (date_i && date_f){        
        if(date_i >= date_f){                    
            throw new ErrorFactory().getError(ErrEnum.InvalidDate);
        }
        return date_i;
      }
      else{                
          throw new ErrorFactory().getError(ErrEnum.InvalidDate);
      }      
    }
    if(prop === 'data_f'){
        return checkDate(obj['data_f']);
    }

} 
}


export class ProxyPartecipazione implements PartecipazioneInterface{
    modelPart: Partecipazione;
    modelAsta: Asta;
    modelUtenti: Utenti;
    proxyPartValidator: any;

    constructor(){

      this.modelPart = new Partecipazione(DB_Connection.getInstance().getConnection());
      this.modelAsta = new Asta(DB_Connection.getInstance().getConnection());
      this.modelUtenti = new Utenti(DB_Connection.getInstance().getConnection());

    }

    public async getClosedAsteByUserID(user_id: number, date_i?: string, date_f?: string): Promise<Array<any>>{
      this.proxyPartValidator = new Proxy({"user_id": user_id, "data_i": date_i, "data_f": date_f}, proxyPartHandler);
      const val_user_id: number = this.proxyPartValidator.user_id;
      if((typeof date_i !== 'undefined' && typeof date_f === 'undefined') || 
         (typeof date_i === 'undefined' && typeof date_f !== 'undefined')) throw new ErrorFactory().getError(ErrEnum.BadRequest);
      
      if(typeof date_i !== 'undefined' && typeof date_f !== 'undefined'){
        const val_data_i: Date = this.proxyPartValidator.data_i;
        const val_data_f: Date = this.proxyPartValidator.data_f;
        return await this.modelPart.getClosedAsteByUserID(val_user_id, val_data_i, val_data_f);
      }
      else{
        return await this.modelPart.getClosedAsteByUserID(val_user_id);
      }      
  
    }
    
    public async getAsteByUserID(user_id: number): Promise<Array<any>>{
      this.proxyPartValidator = new Proxy({"user_id": user_id}, proxyPartHandler);
      const val_user_id: number = this.proxyPartValidator.user_id;
      let partecipazioni = await this.modelPart.getAsteByUserID(val_user_id);
      return partecipazioni;
      
    }

    public async getFirstOfferByAstaID(asta_id: number): Promise<any|null>{
      const offer = await this.modelPart.getFirstOfferByAstaID(asta_id);
      return this.checkOfferExist(offer) === true ? offer : false; 
    }

    public async getOffersByAstaID(asta_id: number): Promise<any>{
      return await this.modelPart.getOffersByAstaID(asta_id);
    }

    public async updatePartecipazione(part: any): Promise<any>{
      return await this.modelPart.updatePartecipazione(part);

    }

    public async setOffer(user_id: number, asta: any, payload: any): Promise<any>{
      let val_offerta: number;
      this.proxyPartValidator = new Proxy(payload, proxyPartHandler);
      val_offerta = this.proxyPartValidator.offerta;

      let offerYet = await this.getOffersByUserAstaID(user_id, asta.asta_id);
      if(asta.tipo !== tipo_asta.ASTA_APERTA && offerYet !== null){
        throw new ErrorFactory().getError(ErrEnum.OfferAlreadyExist);
      }
      else{
        let isExist = offerYet.filter(elem => elem.offerta === val_offerta || 
                                              elem.offerta > val_offerta);
        if(isExist.length !== 0){
          throw new ErrorFactory().getError(ErrEnum.TooLowOfferOrCredit);
        }

      }
      
      if(await this.checkIfValidOffer(user_id, asta.p_min, val_offerta)){

        return this.modelPart.setOffer(JSON.stringify(new ObjectBuilder().setUserID(user_id)
                                                          .setAstaID(payload.asta_id)
                                                          .setAggiudicata(false)
                                                          .setOfferta(val_offerta)
                                                          .build()));
          //{"user_id": user_id, "asta_id": payload.asta_id, "aggiudicata": false, "offerta": val_offerta}

      }
      else{
        throw new ErrorFactory().getError(ErrEnum.TooLowOfferOrCredit);
      }

    }

    public async deleteOffer(part_id: number): Promise<any>{
      return await this.modelPart.deleteOffer(part_id);
    }

    public async getOffersByUserAstaID(user_id: number, asta_id:number): Promise<Array<any>>{
      return await this.modelPart.getOffersByUserAstaID(user_id, asta_id);
      
    }

    public async checkIfValidOffer(user_id: number, base_asta: number, offerta: number): Promise<boolean>{
      let credito = await this.modelUtenti.getCreditoByUserID(user_id).then(value => value.credito);
      return (credito - offerta >= 0 && offerta > base_asta) ? true : false;

    }   

    public checkOfferExist(offers: any): boolean{
      return offers !== null? true : false;
    }

    

}