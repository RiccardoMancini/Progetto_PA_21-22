import { Sequelize, Model, DataTypes, Op } from 'sequelize';
import { Utenti } from './utenti'
import { Asta } from './asta';
import { PartecipazioneInterface } from './interface/partecipazioneInterface';


/**
 * Classe che definisce il modello Partecipazione che permette di interfacciarsi
 * alla rispettiva tabella 'pattecipazione' nel database
 */
export class Partecipazione implements PartecipazioneInterface{
    part: any;
    utenti: any;
    asta: any;

    /**
     * Interazione con i dati tramite l'ORM Sequelize
     * che va a definire il modello asta durante la costruzione dell'oggetto
     */
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

    /**
     * Metodo che estrae l'elenco di aste chiuse alle quali 
     * ha partecipato un certo utente
     * @param user_id id dell'utente da considerare nella selezione
     * @param date_i data inizio dell'intervallo
     * @param date_f data fine dell'intervallo
     * @returns array di oggetti che costituiscono le aste
     */
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
    
    /**
     * Metodo che estrae le aste nelle quali è presente un certo utente
     * @param user_id id utente da considerare
     * @returns array di oggetti che costituiscono le aste
     */
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

    /**
     * Metodo che restituisce l'offerta più alta di una certa asta
     * @param asta_id id asta da considerare
     * @returns oggetto che costituisce l'offerta, altrimenti false
     */
    public async getFirstOfferByAstaID(asta_id: number): Promise<any|null>{
      return await this.part.findOne({
          where: { 
            asta_id: asta_id
          },
          order: [['offerta', 'DESC']]
        })
    }

    /**
     * Metodo che restituisce le prime due offerte di una certa asta
     * @param asta_id id asta da considerare
     * @returns oggetto che costituisce le due offerte
     */
    public async getOffersByAstaID(asta_id: number): Promise<any>{
      return await this.part.findAll({
          limit: 2,
          where: { 
            asta_id: asta_id
          },
          order: [['offerta', 'DESC']]
        })
    }

    /**
     * Metodo per l'update di una certa partecipazione
     * @param part oggetto che rappresenta la partecipazione
     * @returns partecipazione aggiornata
     */
    public async updatePartecipazione(part: any): Promise<any>{
      return await part.save();

    }

    /**
     * Metodo che permette di creare un'offerta per una certa 
     * asta da parte di un utente
     * @param part partecipazione contenente l'offerta validata
     * @returns offerta creata
     */
    public async setOffer(part: string): Promise<any>{
      let partJson = JSON.parse(part);
      return await this.part.create(partJson);
      
    }

    /**
     * Metodo per la rimozione di una determinata offerta
     * @param part_id id part che contraddistingue l'offerta
     * @returns 
     */
    public async deleteOffer(part_id: number): Promise<any>{
      return await this.part.destroy({
        where: { part_id: part_id },
      });
    }

    /**
     * Metodo usato per estrarre tutte le offerte di un certo utente
     * per una data asta
     * @param user_id id utente dal considerare
     * @param asta_id id asta da consderara
     * @returns array di oggetti rappresentanti l'offerta
     */
    public async getOffersByUserAstaID(user_id: number, asta_id:number): Promise<Array<any>>{
      return await this.part.findAll({
        where: {user_id: user_id, asta_id: asta_id}
      })      
    }
    
    /**
     * @returns modello partecipazione
     */
    public getModelpart(): any{
        return this.part;
    }

}