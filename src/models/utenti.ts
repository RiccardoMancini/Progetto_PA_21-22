import { Sequelize, Model, DataTypes } from 'sequelize';
import { UtentiInterface } from './interface/utentiInterface';

/**
 * Classe che definisce il modello Utenti che permette di interfacciarsi
 * alla rispettiva tabella 'utenti' nel database
 */
export class Utenti implements UtentiInterface{
    utenti: any;

    /**
     * Interazione con i dati tramite l'ORM Sequelize
     * che va a definire il modello utenti durante la costruzione dell'oggetto
     */
    constructor(sequelize: Sequelize)
    {
        this.utenti = sequelize.define("utenti", {
            user_id: {
              type: DataTypes.INTEGER,
              autoIncrement: true,
              primaryKey: true
            },
            nome: { type: DataTypes.STRING },
            ruolo: { type: DataTypes.SMALLINT },
            credito: { type: DataTypes.FLOAT }
          }, {
            tableName: 'utenti',
            timestamps: false
          });

    }

    /**
     * Metodo che restituisce i dati riguardanti un utente
     * @param user_id id dell'utente che si vuole selezionare
     * @returns oggetto rappresentante l'utente
     */
    public async getUserByID(user_id: number): Promise<any|null>{
      return await this.utenti.findByPk(user_id);
    }

    /**
     * Metodo che restituisce il credito di un certo utente
     * @param user_id id dell'utente che si vuole selezionare
     * @returns credito
     */
    public async getCreditoByUserID(user_id: number): Promise<any>{
      return await this.utenti.findOne({
        attributes: ['credito'],
        where: {
          user_id: user_id 
        },
      })
    }

    /**
     * Metodo che aggiorna il credito di un certo utente
     * @param payload body della richiesta
     * @param afterOffer flag booleano
     * @returns oggetto con il nuovo credito dell'utente
     */
    public async updateCreditoUtente(user_id: number, credito: number): Promise<any>{
      let userByID = await this.getUserByID(user_id);
      userByID.credito = userByID.credito + credito;
      await userByID.save();
      return userByID;
    }

    /**
     * @returns modello utenti
     */
    public getModelUtenti(): any{
        return this.utenti;
    }


}