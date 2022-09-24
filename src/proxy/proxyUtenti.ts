import { DB_Connection } from '../config/db_connection';
import { Utenti } from "../models/utenti";
import { ErrEnum, ErrorFactory } from '../factory/errorFactory';
import { UtentiInterface } from '../models/interface/utentiInterface';

// Oggetto che viene passato come handler dell'oggetto proxy
const proxyUtentiHandler = {
    get: (obj, prop) => {                
        if(prop === 'credito'){
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
    }
}

// Classe proxy corrispondente al modello utenti
export class ProxyUtenti implements UtentiInterface{
    modelUtenti: Utenti;
    proxyUtenteValidator: any;

    constructor(){

        this.modelUtenti = new Utenti(DB_Connection.getInstance().getConnection());

    }

    /**
     * Metodo che restituisce i dati riguardanti un utente
     * @param user_id id dell'utente che si vuole selezionare
     * @returns oggetto rappresentante l'utente
     */
    public async getUserByID(user_id: number): Promise<any|null>{
        return await this.modelUtenti.getUserByID(user_id);
    }

    /**
     * Metodo che restituisce il credito di un certo utente
     * @param user_id id dell'utente che si vuole selezionare
     * @returns credito
     */
    public async getCreditoByUserID(user_id: number): Promise<any>{
        // check dell'esistenza dell'utente
        await this.checkUserExists(user_id);
        return await this.getUserByID(user_id).then(value => value.credito);            
    }

    /**
     * Metodo che aggiorna il credito di un certo utente
     * @param payload body della richiesta
     * @param afterOffer flag booleano
     * @returns oggetto con il nuovo credito dell'utente
     */
    public async updateCreditoUtente(payload: any, afterOffer: boolean = false): Promise<any>{
        let val_credito: number;
        let val_user_id: number;
        if( afterOffer === false){
            // validazione del nuovo credito e dell'id passato
            this.proxyUtenteValidator = new Proxy(payload, proxyUtentiHandler);            
            val_credito = this.proxyUtenteValidator.credito;
            //console.log(val_credito)
            val_user_id = this.proxyUtenteValidator.user_id;
            // check se l'utente esiste
            await this.checkUserExists(val_user_id);
        }
        else{
            val_user_id = payload.user_id;
            val_credito = payload.addebito;
        }

        //console.log(val_user_id, Number(val_credito.toFixed(3)));

        let userByID: any = await this.modelUtenti.updateCreditoUtente(val_user_id, Number(val_credito.toFixed(3)));            
    
        return userByID;    
    }

    /**
     * Metodo utilizzato per la verifica dell'esistenza di un utente
     * @param user_id id dell'utente che si vuole selezionare
     */
    public async checkUserExists(user_id: number): Promise<void>{
        let userCheck = await this.modelUtenti.getModelUtenti().findByPk(user_id);
        if(userCheck === null){
            throw new ErrorFactory().getError(ErrEnum.UserNotFound);
        }
    }
}

