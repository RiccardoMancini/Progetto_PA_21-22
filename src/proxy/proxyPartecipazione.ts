import { DB_Connection } from '../config/db_connection'
import { ObjectBuilder } from '../controllers/builder/objectBuilder';
import { ErrEnum, ErrorFactory } from '../factory/errorFactory';
import { Asta, tipo_asta } from "../models/asta";
import { PartecipazioneInterface } from '../models/interface/partecipazioneInterface';
import { Partecipazione } from '../models/partecipazione';
import { Utenti } from '../models/utenti';
import { checkDate } from './proxyAsta';

// Oggetto che viene passato come handler dell'oggetto proxy
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

// Classe proxy corrispondente al modello partecipazione
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

    /**
     * Metodo che estrae l'elenco di aste chiuse alle quali 
     * ha partecipato un certo utente
     * @param user_id id dell'utente da considerare nella selezione
     * @param date_i data inizio dell'intervallo
     * @param date_f data fine dell'intervallo
     * @returns array di oggetti che costituiscono le aste
     */
    public async getClosedAsteByUserID(user_id: number, date_i?: string, date_f?: string): Promise<Array<any>>{
      this.proxyPartValidator = new Proxy({"user_id": user_id, "data_i": date_i, "data_f": date_f}, proxyPartHandler);
      const val_user_id: number = this.proxyPartValidator.user_id;
      if((typeof date_i !== 'undefined' && typeof date_f === 'undefined') || 
         (typeof date_i === 'undefined' && typeof date_f !== 'undefined')) throw new ErrorFactory().getError(ErrEnum.BadRequest);
      // validazione delle date passate come intervallos
      if(typeof date_i !== 'undefined' && typeof date_f !== 'undefined'){
        const val_data_i: Date = this.proxyPartValidator.data_i;
        const val_data_f: Date = this.proxyPartValidator.data_f;
        return await this.modelPart.getClosedAsteByUserID(val_user_id, val_data_i, val_data_f);
      }
      else{
        return await this.modelPart.getClosedAsteByUserID(val_user_id);
      }      
  
    }
    
    /**
     * Metodo che estrae le aste nelle quali è presente un certo utente
     * @param user_id id utente da considerare
     * @returns array di oggetti che costituiscono le aste
     */
    public async getAsteByUserID(user_id: number): Promise<Array<any>>{
      this.proxyPartValidator = new Proxy({"user_id": user_id}, proxyPartHandler);
      const val_user_id: number = this.proxyPartValidator.user_id;
      let partecipazioni = await this.modelPart.getAsteByUserID(val_user_id);
      return partecipazioni;
      
    }

    /**
     * Metodo che restituisce l'offerta più alta di una certa asta
     * @param asta_id id asta da considerare
     * @returns oggetto che costituisce l'offerta, altrimenti false
     */
    public async getFirstOfferByAstaID(asta_id: number): Promise<any|null>{
      const offer = await this.modelPart.getFirstOfferByAstaID(asta_id);
      return this.checkOfferExist(offer) === true ? offer : false; 
    }

    /**
     * Metodo che restituisce le prime due offerte di una certa asta
     * @param asta_id id asta da considerare
     * @returns oggetto che costituisce le due offerte
     */
    public async getOffersByAstaID(asta_id: number): Promise<any>{
      return await this.modelPart.getOffersByAstaID(asta_id);
    }

    /**
     * Metodo per l'update di una certa partecipazione
     * @param part oggetto che rappresenta la partecipazione
     * @returns partecipazione aggiornata
     */
    public async updatePartecipazione(part: any): Promise<any>{
      return await this.modelPart.updatePartecipazione(part);

    }

    /**
     * Metodo che permette di creare un'offerta per una certa 
     * asta da parte di un utente
     * @param user_id id utente che fa l'offerta
     * @param asta oggetto asta di riferimento
     * @param payload body della richiesta da validare
     * @returns offerta creata
     */
    public async setOffer(user_id: number, asta: any, payload: any): Promise<any>{
      let val_offerta: number;
      this.proxyPartValidator = new Proxy(payload, proxyPartHandler);
      val_offerta = this.proxyPartValidator.offerta;

      // check se esiste già un'offerta dello stesso tipo
      let offerYet: any = await this.getOffersByUserAstaID(user_id, asta.asta_id);
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
      // check se l'offerta è superiore dell'base d'asta e se l'utente ha il 
      // credito sufficiente
      if(await this.checkIfValidOffer(user_id, asta.p_min, val_offerta)){

        return this.modelPart.setOffer(JSON.stringify(new ObjectBuilder().setUserID(user_id)
                                                          .setAstaID(payload.asta_id)
                                                          .setAggiudicata(false)
                                                          .setOfferta(val_offerta)
                                                          .build()));
      }
      else{
        throw new ErrorFactory().getError(ErrEnum.TooLowOfferOrCredit);
      }

    }

    /**
     * Metodo per la rimozione di una determinata offerta
     * @param part_id id part che contraddistingue l'offerta
     * @returns 
     */
    public async deleteOffer(part_id: number): Promise<any>{
      return await this.modelPart.deleteOffer(part_id);
    }

    /**
     * Metodo usato per estrarre tutte le offerte di un certo utente
     * per una data asta
     * @param user_id id utente dal considerare
     * @param asta_id id asta da consderara
     * @returns array di oggetti rappresentanti l'offerta
     */
    public async getOffersByUserAstaID(user_id: number, asta_id:number): Promise<Array<any>>{
      return await this.modelPart.getOffersByUserAstaID(user_id, asta_id);
      
    }

    /**
     * Metodo che verifica se l'offerta di un certo utente è maggiore della base d'asta
     * e minore del suo attuale credito
     * @param user_id id utente da considerare
     * @param base_asta base d'asta
     * @param offerta offerta fatta dall'utente
     * @returns true se l'offerta è valida, false altrimenti
     */
    public async checkIfValidOffer(user_id: number, base_asta: number, offerta: number): Promise<boolean>{
      let credito = await this.modelUtenti.getCreditoByUserID(user_id).then(value => value.credito);
      return (credito - offerta >= 0 && offerta > base_asta) ? true : false;

    }   

    public checkOfferExist(offers: any): boolean{
      return offers !== null? true : false;
    }

    

}