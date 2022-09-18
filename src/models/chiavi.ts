import { Sequelize, Model, DataTypes } from 'sequelize';

export class Chiavi{
    chiavi: any;
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


    public async getChiavi(){
      return await this.chiavi.findAll();
    }

    
    public getModelChiavi(){
      return this.chiavi;
    }

    
   

}