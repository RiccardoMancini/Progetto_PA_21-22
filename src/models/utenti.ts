import { Sequelize, Model, DataTypes } from 'sequelize';
import { UtentiInterface } from './interface/utentiInterface';

export class Utenti implements UtentiInterface{

    utenti: any;

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

    public async getUserByID(user_id: number): Promise<any|null>{
      return await this.utenti.findByPk(user_id);
    }

    public async getCreditoByUserID(user_id: number): Promise<any|null>{
      return await this.utenti.findOne({
        attributes: ['credito'],
        where: {
          user_id: user_id 
        },
      })
    }

    
    public async updateCreditoUtente(user_id: number, credito: number): Promise<any>{
      let userByID = await this.getUserByID(user_id);
      userByID.credito = userByID.credito + credito;
      await userByID.save();
      return userByID;
    }

    public getModelUtenti(): any{
        return this.utenti;
    }


}