import { DB_Connection } from '../config/db_connection';
import { Utenti } from "../models/utenti";

const checkBodyHandler = {
    get: (obj, prop) => {                
        if(prop === 'credito'){
            if (!Number(obj[prop])) {
                throw new TypeError('The credito is not a number');
              }
            if (obj[prop] < 1) {
                throw new RangeError('The credito seems invalid. Choose a number > 0');
              }
            
            return obj[prop];
        }
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


export class ProxyUtenti{
    modelUtenti: any;
    proxyUtenteValidator: any;

    constructor(){

        this.modelUtenti = new Utenti(DB_Connection.getInstance().getConnection());

    }
    
    /*public async getUtenti(){
        return await this.modelUtenti.getUtenti();
    }*/

    public async getUserByID(user_id: number){
      return await this.modelUtenti.getUserByID(user_id);
    }

    public async getCreditoByUserID(user_id: number){
        try{
            await this.checkUserExists(user_id);
            return await this.getUserByID(user_id).then(value => value.credito);
        }
        catch(err){
            console.log(err);
        }          
    }

    public async updateCreditoUtente(payload: any, afterOffer: boolean = false){
        try{
            let val_credito: number;
            let val_user_id: number;
            if( afterOffer === false){
                this.proxyUtenteValidator = new Proxy(payload, checkBodyHandler);
                val_credito = this.proxyUtenteValidator.credito;
                val_user_id = this.proxyUtenteValidator.user_id;
                await this.checkUserExists(val_user_id);
            }
            else{
                val_user_id = payload.user_id;
                val_credito = payload.addebito;
            }

            console.log(val_user_id, val_credito);

            let userByID = await this.modelUtenti.updateCreditoUtente(val_user_id, val_credito);            
        
            return userByID;

        }
        catch(err){
            console.log(err);
        }        
    }

    public async checkUserExists(user_id: number): Promise<void>{
        let userCheck = await this.modelUtenti.getModelUtenti().findByPk(user_id);
        if(userCheck === null){
            throw new TypeError('Utente non trovato');
        }
    }
}

