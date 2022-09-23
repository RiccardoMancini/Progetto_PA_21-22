import { DB_Connection } from '../config/db_connection';
import { Chiavi} from '../models/chiavi'; 
import { ChiaviInterface } from '../models/interface/chiaviInterface';

// Classe proxy corrispondente al modello chiavi
export class ProxyChiavi implements ChiaviInterface{
    modelChiavi: Chiavi;

    constructor(){
        this.modelChiavi = new Chiavi(DB_Connection.getInstance().getConnection());
    }

    /**
     * Metodo che selezione tutte le coppie di chiavi nel db
     * @returns un'array di oggetti rappresentanti le chiavi
     */
    public async getChiavi(): Promise<Array<any>>{
        return await this.modelChiavi.getChiavi();
        
    }



}