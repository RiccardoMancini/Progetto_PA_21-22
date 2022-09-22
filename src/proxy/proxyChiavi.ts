import { DB_Connection } from '../config/db_connection';
import { Chiavi} from '../models/chiavi'; 


export class ProxyChiavi{

    modelChiavi: Chiavi;

    constructor(){

        this.modelChiavi = new Chiavi(DB_Connection.getInstance().getConnection());

    }

    public async getChiavi(): Promise<Array<any>>{
        return await this.modelChiavi.getChiavi();
        
    }



}