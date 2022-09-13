import { Sequelize, Model, DataTypes } from 'sequelize';
import { DB_Connection } from '../config/db_connection'
import { Chiavi } from './chiavi';

export enum tipo_asta{
    ASTA_APERTA = 1,
    ASTA_CHIUSA_1 = 2,
    ASTA_CHIUSA_2 = 3
}
export enum stato_asta {
    NON_APERTA = 1,
    IN_ESECUZIONE = 2,
    TERMINATA = 3
}


export class Asta{
    asta: any;
    chiavi: any
    constructor()
    {
        this.chiavi = new Chiavi()
        let sequelize: Sequelize = DB_Connection.getInstance().getConnection(); 

        this.asta = sequelize.define("asta", {
            asta_id: {
              type: DataTypes.INTEGER,
              autoIncrement: true,
              primaryKey: true
            },
            tipo: { type: DataTypes.TINYINT /*validate: {is: /^[0,1,2]{1}$/ }*/},
            p_min: { type: DataTypes.BIGINT },
            stato: { type: DataTypes.TINYINT },
            data_i: { type: DataTypes.DATE },
            data_f: { type: DataTypes.DATE },
            chiavi_id: { type: DataTypes.SMALLINT }
          }, {
            tableName: 'asta',
            timestamps: false
          });
        
        this.chiavi.getModelChiavi().hasMany(this.asta, { foreignKey: 'chiavi_id'});
        this.asta.belongsTo(this.chiavi.getModelChiavi(), { foreignKey: 'chiavi_id'});
    }

    public async getAste(){
        let aste = await this.asta.findAll();

        return aste;
    }


    public getModelAsta(){
        return this.asta;
    }

    

    public async setParamiter(tipo_asta:number,base_asta:number,data_i:number,data_f:number){
        this.asta.tipo = tipo_asta;
        this.asta.p_min = base_asta;
        this.asta.data_i = data_i;
        this.asta.data_f = data_f;
    }

}