import { Sequelize, Model, DataTypes, Op } from 'sequelize';
import { Utenti } from './utenti'
import { Asta } from './asta';
import { PartecipazioneInterface } from './interface/partecipazioneInterface';


export class Partecipazione implements PartecipazioneInterface{
    part: any;
    utenti: any;
    asta: any;

    constructor(sequelize: Sequelize)
    {
        this.utenti = new Utenti(sequelize);
        this.asta = new Asta(sequelize);

        this.part = sequelize.define("partecipazione", {
            part_id: {
              type: DataTypes.INTEGER,
              autoIncrement: true,
              primaryKey: true
            },
            user_id: { type: DataTypes.INTEGER},
            asta_id: { type: DataTypes.INTEGER },
            aggiudicata: { type: DataTypes.BOOLEAN },
            offerta: { type: DataTypes.FLOAT }
          }, {
            tableName: 'partecipazione',
            timestamps: false
          });

        // Associazioni tra le entità
        this.utenti.getModelUtenti().hasMany(this.part, { foreignKey: 'user_id'});
        this.part.belongsTo(this.utenti.getModelUtenti(), { foreignKey: 'user_id'});
        this.asta.getModelAsta().hasMany(this.part, { foreignKey: 'asta_id'});
        this.part.belongsTo(this.asta.getModelAsta(), { foreignKey: 'asta_id'});


    }

    public async getClosedAsteByUserID(user_id: number, date_i?: string | Date, date_f?: string | Date): Promise<Array<any>>{
      if(typeof date_i !== 'undefined' && typeof date_f !== 'undefined'){
        return await this.part.findAll({
          include: [{
          model: this.utenti.getModelUtenti(),
          where: {
            user_id: user_id
          }}, 
          {
          model: this.asta.getModelAsta(),
          where: {
            stato: 3,
            data_f: {
              [Op.between]: [date_i, date_f] 
          }}}]        
        });
      }
      else{
        return await this.part.findAll({
          include: [{
          model: this.utenti.getModelUtenti(),
          where: {
            user_id: user_id
          }}, 
          {
          model: this.asta.getModelAsta(),
          where: {
            stato: 3
          }}]        
        });
      }
    }
  
    public async getAsteByUserID(user_id: number): Promise<Array<any>>{
      return await this.part.findAll({
        include: {
        model: this.asta.getModelAsta(),
        where: {
          stato: [2, 3]
        }},
        where: {
          user_id: user_id
        }
        
      });
    }

    public async getFirstOfferByAstaID(asta_id: number): Promise<any|null>{
      return await this.part.findOne({
          where: { 
            asta_id: asta_id
          },
          order: [['offerta', 'DESC']]
        })
    }

    public async getOffersByAstaID(asta_id: number): Promise<any>{
      return await this.part.findAll({
          limit: 2,
          where: { 
            asta_id: asta_id
          },
          order: [['offerta', 'DESC']]
        })
    }

    public async updatePartecipazione(part: any): Promise<any>{
      return await part.save();

    }

    public async setOffer(part: string): Promise<any>{
      let partJson = JSON.parse(part);
      return await this.part.create(partJson);
      
    }

    public async deleteOffer(part_id: number): Promise<any>{
      return await this.part.destroy({
        where: { part_id: part_id },
      });
    }

    public async getOffersByUserAstaID(user_id: number, asta_id:number): Promise<Array<any>>{
      return await this.part.findAll({
        where: {user_id: user_id, asta_id: asta_id}
      })      
    }
    
    public getModelpart(): any{
        return this.part;
    }

}