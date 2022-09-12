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

    constructor()
    {
        let sequelize: Sequelize = DB_Connection.getInstance().getConnection(); 

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

    public async getUtenti(): Promise<Object>{
        return await this.utenti.findAll();
    }

    public async getUtenteById(user_id:any){
      return await this.utenti.findOne(user_id);
  }

    public getModelUtenti(){
        return this.utenti;
    }


}