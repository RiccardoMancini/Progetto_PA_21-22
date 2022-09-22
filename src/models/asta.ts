import { Sequelize, Model, DataTypes } from 'sequelize';
import { Chiavi } from './chiavi';
import { AstaInterface } from './interface/astaInterface';

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

/**
 * Classe che definisce il modello Asta che permette di interfacciarsi
 * alla rispettiva tabella 'asta' nel database
 */
export class Asta implements AstaInterface{
    asta: any;
    chiavi: any

    /**
     * Interazione con i dati tramite l'ORM Sequelize
     * che va a definire il modello asta durante la costruzione dell'oggetto
     */
    constructor(sequelize: Sequelize){
        this.chiavi = new Chiavi(sequelize);
        this.asta = sequelize.define("asta", {
            asta_id: {
              type: DataTypes.INTEGER,
              autoIncrement: true,
              primaryKey: true
            },
            tipo: { type: DataTypes.TINYINT},
            p_min: { type: DataTypes.FLOAT },
            stato: { type: DataTypes.TINYINT },
            data_i: { type: DataTypes.DATE },
            data_f: { type: DataTypes.DATE },
            chiavi_id: { type: DataTypes.SMALLINT }
          }, {
            tableName: 'asta',
            timestamps: false
          });
        
        // Associazioni tra le entità
        this.chiavi.getModelChiavi().hasMany(this.asta, { foreignKey: 'chiavi_id'});
        this.asta.belongsTo(this.chiavi.getModelChiavi(), { foreignKey: 'chiavi_id'});
    }

    /**
     * Metodo che ricerca un'asta non aperta
     * @param asta_id id dell'asta da cercare
     * @returns l'oggetto rappresentante l'asta estratta
     */
    public async getNotOpenAstaByID(asta_id: number): Promise<any|null>{
        return await this.asta.findOne({ where: { asta_id: asta_id, stato: stato_asta.NON_APERTA }});
    }

    /**
     * Metodo che ricerca un'asta non aperta
     * @param asta_id id dell'asta da cercare
     * @returns l'oggetto rappresentante l'asta estratta
     */
    public async getOpenAstaByID(asta_id: number): Promise<any|null>{
        return await this.asta.findOne({ where: { asta_id: asta_id, stato: stato_asta.IN_ESECUZIONE },
        include: this.chiavi.getModelChiavi()});
    }

    /**
     * Metodo che seleziona tutte le aste esistenti nel db
     * @returns un'array di oggetti rappresentanti le aste
     */
    public async getAste(): Promise<Array<any>>{
        return await this.asta.findAll();        
    }

    /**
     * Metodo che permette l'update di un'asta
     * @param asta oggetto asta da aggiornare nel db
     * @returns l'asta aggiornata
     */
    public async updateAsta(asta: any): Promise<any>{
        return await asta.save();
    }

    /**
     * Metodo che crea una nuova asta nel db
     * @param asta stringa che costituisce l'asta da inserire nel db
     * @returns l'asta inserita
     */
    public async createAsta(asta:string): Promise<any>{
        let astaJson = JSON.parse(asta);
        return await this.asta.create(astaJson);
    }

    /**
     * @returns modello asta 
     */
    public getModelAsta(): any{
        return this.asta;
    }



}