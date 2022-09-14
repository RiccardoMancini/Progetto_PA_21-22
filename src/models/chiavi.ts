import { Sequelize, Model, DataTypes } from 'sequelize';
import { DB_Connection } from '../config/db_connection'

export class Chiavi{
    chiavi: any;
    constructor() {
        let sequelize: Sequelize = DB_Connection.getInstance().getConnection(); 

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

    public async getRandomKey(){
      let max = await this.chiavi.count();
      let keyID = Math.round(Math.random() * (max - 1) + 1);
      return keyID;
  }

    public getModelChiavi(){
        return this.chiavi;
    }

    public async getChiavi(){
      let tChiavi= await this.chiavi.findAll();
      return tChiavi;
    }

    public async getChiaviById(Key_id){
      let tchiavi= await this.chiavi.findByPk(Key_id);
      return tchiavi;
    }
    // fare una lista con l'elenco degli id presenti nel modello chiavi;
    // estrai randomicamente uno degli indici della lista
    // poi estrarre con findByPk il valore dell'indice estratto nel modello chiavi
    public async randomKey(){
        let max = await this.chiavi.count();
        let keyID = Math.round(Math.random() * (max - 1) + 1);
        return keyID;
    }

   

}