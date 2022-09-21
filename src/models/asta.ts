import { Sequelize, Model, DataTypes } from 'sequelize';
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

    constructor(sequelize: Sequelize){
        this.chiavi = new Chiavi(sequelize);

        this.asta = sequelize.define("asta", {
            asta_id: {
              type: DataTypes.INTEGER,
              autoIncrement: true,
              primaryKey: true
            },
            tipo: { type: DataTypes.TINYINT /*validate: {is: /^[0,1,2]{1}$/ }*/},
            p_min: { type: DataTypes.FLOAT },
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

    public async getNotOpenAstaByID(asta_id: number){
        return await this.asta.findOne({ where: { asta_id: asta_id, stato: stato_asta.NON_APERTA }});
    }

    public async getOpenAstaByID(asta_id: number){
        return await this.asta.findOne({ where: { asta_id: asta_id, stato: stato_asta.IN_ESECUZIONE },
        include: this.chiavi.getModelChiavi()});
    }

    public async getAste(){
        return await this.asta.findAll();        
    }

    public async updateAsta(asta: any){
        return await asta.save();
    }

    public async createAsta(asta:string){
        let astaJson = JSON.parse(asta);
        return await this.asta.create(astaJson);
    }


    public getModelAsta(){
        return this.asta;
    }



}