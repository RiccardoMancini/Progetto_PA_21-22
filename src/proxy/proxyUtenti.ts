import { DB_Connection } from '../config/db_connection';
import { Utenti } from "../models/utenti";
import { ErrEnum, ErrorFactory } from '../factory/errorFactory';

const checkBodyHandler = {
    get: (obj, prop) => {                
        if(prop === 'credito'){
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


export class ProxyUtenti{
    modelUtenti: any;
    proxyUtenteValidator: any;

    constructor(){

        this.modelUtenti = new Utenti(DB_Connection.getInstance().getConnection());

    }

    public async getUserByID(user_id: number){
        return await this.modelUtenti.getUserByID(user_id);
    }

    public async getCreditoByUserID(user_id: number){
        await this.checkUserExists(user_id);
        return await this.getUserByID(user_id).then(value => value.credito);            
    }

    public async updateCreditoUtente(payload: any, afterOffer: boolean = false){
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

        console.log(val_user_id, Number(val_credito.toFixed(3)));

        let userByID = await this.modelUtenti.updateCreditoUtente(val_user_id, Number(val_credito.toFixed(3)));            
    
        return userByID;    
    }

    public async checkUserExists(user_id: number): Promise<void>{
        let userCheck = await this.modelUtenti.getModelUtenti().findByPk(user_id);
        if(userCheck === null){
            throw new ErrorFactory().getError(ErrEnum.UserNotFound);
        }
    }
}

