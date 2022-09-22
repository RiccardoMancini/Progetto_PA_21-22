import { Sequelize, Model, DataTypes } from 'sequelize';
import { ChiaviInterface } from './interface/chiaviInterface';


/**
 * Classe che definisce il modello Chiavi che permette di interfacciarsi
 * alla rispettiva tabella 'chiavi' nel database
 */
export class Chiavi implements ChiaviInterface{
    chiavi: any;

    /**
     * Interazione con i dati tramite l'ORM Sequelize
     * che va a definire il modello chiavi durante la costruzione dell'oggetto
     */
    constructor(sequelize: Sequelize) {
        this.chiavi = sequelize.define("chiavi", {
            chiavi_id: {
              type: DataTypes.TINYINT,
              autoIncrement: true,
              primaryKey: true
            },
            public_key: { type: DataTypes.STRING},
            private_key: { type: DataTypes.STRING}
          }, {
            tableName: 'chiavi',
            timestamps: false
          });        
    }

    /**
     * Metodo che selezione tutte le coppie di chiavi nel db
     * @returns un'array di oggetti rappresentanti le chiavi
     */
    public async getChiavi(): Promise<Array<any>>{
      return await this.chiavi.findAll();
    }

    /**
     * @returns modello chiavi
     */
    public getModelChiavi(): any{
      return this.chiavi;
    }

    
   

}