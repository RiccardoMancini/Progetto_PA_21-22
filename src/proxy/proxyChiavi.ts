import { DB_Connection } from '../config/db_connection';
import { Chiavi} from '../models/chiavi'; 


export class ProxyChiavi{

    modelChiavi: any;
    proxyChiaviValidator: any

    constructor(){

        this.modelChiavi = new Chiavi(DB_Connection.getInstance().getConnection());

    }

    public async getChiavi(){
        return await this.modelChiavi.getChiavi();
        
    }



}