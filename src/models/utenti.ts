import { Sequelize, Model, DataTypes } from 'sequelize';
import { DB_Connection } from '../config/db_connection'

export class Utenti{
    /*user_id: number;
    username: string;
    nome: string;
    cognome: string;
    ruolo: string;
    credito: string;*/
    utenti: any;

    constructor(sequelize: Sequelize)
    {

        this.utenti = sequelize.define("utenti", {
            user_id: {
              type: DataTypes.INTEGER,
              autoIncrement: true,
              primaryKey: true
            },
            username: { type: DataTypes.STRING },
            nome: { type: DataTypes.STRING },
            cognome: { type: DataTypes.STRING },
            ruolo: { type: DataTypes.SMALLINT },
            credito: { type: DataTypes.BIGINT }
          }, {
            tableName: 'utenti',
            timestamps: false
          });

    }

    public async getUtenti(){
        return await this.utenti.findAll();
    }

    public async getUserByID(user_id: number){
      return await this.utenti.findByPk(user_id);
    }

    public async getCreditoByUserID(user_id: number){
      return await this.utenti.findOne({
        attributes: ['credito'],
        where: {
          user_id: user_id 
        },
      })
    }

    // Questo trick è stato fatto per avere lo stesso tipo di return del proxy
    // però in caso si potrebbe risolvere se l'interfaccia che implementeranno (UtenteInterface)
    // restituissero qualcosa di generico <T>
    public async updateCreditoUtente(user_id: number, credito: number){
      let userByID = await this.getUserByID(user_id);
      userByID.credito = userByID.credito + credito;
      await userByID.save();
      return userByID;
    }

    public getModelUtenti(){
        return this.utenti;
    }


}