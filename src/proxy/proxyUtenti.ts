import { Sequelize, Model, DataTypes } from 'sequelize';
import { DB_Connection } from '../config/db_connection'
import { Utenti } from "../models/utenti";

const checkBodyHandler = {
    get: (obj, prop) => {                
        if(prop === 'credito'){
            if (!Number.isInteger(obj[prop])) {
                throw new TypeError('The credito is not an integer');
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

    public async updateCreditoUtente(payload: any){
        try{
            this.proxyUtenteValidator = new Proxy(payload, checkBodyHandler);
            const val_credito = this.proxyUtenteValidator.credito;
            const val_user_id = this.proxyUtenteValidator.user_id;
            await this.checkUserExists(val_user_id);

            let userByID = await this.getUserByID(val_user_id);
            userByID.credito = userByID.credito + val_credito;
            await userByID.save();
        
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

