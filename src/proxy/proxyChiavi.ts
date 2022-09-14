import { DB_Connection } from '../config/db_connection';
import { Chiavi} from '../models/chiavi'; 


const checkBodyHandler = {
    get: (obj, prop) => { 
        if(prop === 'chiavi_id'){
            if (!Number(obj[prop])&&(obj[prop]<1)) {
                throw new TypeError('chiave non valida');
              }
        }
        return obj[prop];
    } 

    export class ProxyChiavi{
        modelChiavi: any ;
        proxyChiaviValidator: any
    
        constructor(){
    
            this.modelChiavi = new Chiavi (DB_Connection.getInstance().getConnection());
    
        }
        
    
        public async getChiaviById( chiavi_id: number){
          return await this.ModelChiavi.getUserByID(chiavi_id);
        }



}