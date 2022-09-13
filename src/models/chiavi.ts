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

   

}