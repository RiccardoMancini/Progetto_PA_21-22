import { DB_Connection } from '../config/db_connection';
import { Chiavi} from '../models/chiavi'; 
import { ChiaviInterface } from '../models/interface/chiaviInterface';


export class ProxyChiavi implements ChiaviInterface{

    modelChiavi: Chiavi;

    constructor(){

        this.modelChiavi = new Chiavi(DB_Connection.getInstance().getConnection());

    }

    public async getChiavi(): Promise<Array<any>>{
        return await this.modelChiavi.getChiavi();
        
    }



}