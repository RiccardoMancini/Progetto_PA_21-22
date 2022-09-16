import { Sequelize, Model, DataTypes } from 'sequelize';
import { Utenti } from './utenti'
import { Asta } from './asta';


export class Partecipazione{
    partecipazione: any;
    utenti: any;
    asta: any;

    constructor(sequelize: Sequelize)
    {
        this.utenti = new Utenti(sequelize);
        this.asta = new Asta(sequelize);

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

    public async getClosedAsteByUserID(user_id: number){
      /*const date_i = String(date_obj_i.getFullYear())+'-'+String(date_obj_i.getMonth()+1)+'-'+String(date_obj_i.getDate())
      const date_f = String(date_obj_f.getFullYear())+'-'+String(date_obj_f.getMonth()+1)+'-'+String(date_obj_f.getDate())
      console.log(date_i, date_f)*/
      let partecipazioni = await this.partecipazione.findAll({
        include: [{
        model: this.utenti.getModelUtenti(),
        where: {
          user_id: user_id
        }}, 
        {
        model: this.asta.getModelAsta(),
        where: {
          stato: 3
          /*from: {
            $between: [date_i, date_f]
        }*/}}]
        
    });

    return partecipazioni;

    }
  
    public async getAsteByUserID(user_id: number){
      let partecipazioni = await this.partecipazione.findAll({
        include: {
        model: this.asta.getModelAsta(),
        where: {
          stato: [2, 3]
        }},
        where: {
          user_id: user_id
        }
        
    });
    return partecipazioni
    }

    public async getFirstOfferByAstaID(asta_id: number){
      return await this.partecipazione.findOne({
          where: { 
            asta_id: asta_id
          },
          order: [['offerta', 'DESC']]
        })
    }

    public async getOffersByAstaID(asta_id: number){
      return await this.partecipazione.findAll({
          limit: 2,
          where: { 
            asta_id: asta_id
          },
          order: [['offerta', 'DESC']]
        })
    }

    public async updatePartecipazione(part: any){
      return await part.save();

    }
    
    public getModelPartecipazione(){
        return this.partecipazione;
    }

}