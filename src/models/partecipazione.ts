import { Sequelize, Model, DataTypes } from 'sequelize';
import { DB_Connection } from '../config/db_connection';
import { Utenti } from './utenti'
import { Asta } from './asta';


export class Partecipazione{
    partecipazione: any;
    utenti: any;
    asta: any;

    constructor()
    {
        this.utenti = new Utenti();
        this.asta = new Asta();
        let sequelize: Sequelize = DB_Connection.getInstance().getConnection(); 

        this.partecipazione = sequelize.define("partecipazione", {
            part_id: {
              type: DataTypes.INTEGER,
              autoIncrement: true,
              primaryKey: true
            },
            user_id: { type: DataTypes.INTEGER},
            asta_id: { type: DataTypes.INTEGER },
            aggiudicata: { type: DataTypes.BOOLEAN },
            offerta: { type: DataTypes.BIGINT }
          }, {
            tableName: 'partecipazione',
            timestamps: false
          });

        // Associazioni tra le entità
        this.utenti.getModelUtenti().hasMany(this.partecipazione, { foreignKey: 'user_id'});
        this.partecipazione.belongsTo(this.utenti.getModelUtenti(), { foreignKey: 'user_id'});
        this.asta.getModelAsta().hasMany(this.partecipazione, { foreignKey: 'asta_id'});
        this.partecipazione.belongsTo(this.asta.getModelAsta(), { foreignKey: 'asta_id'});


    }

    public async getPartecipazioni(): Promise<Object>{
        
        let partecipazioni = await this.partecipazione.findAll({
            include: [this.asta.getModelAsta(), this.utenti.getModelUtenti()],
            
        });

        return partecipazioni;
    }


    
    public getModelPartecipazione(){
        return this.partecipazione;
    }

}