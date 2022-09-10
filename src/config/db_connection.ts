import { Sequelize, Model, DataTypes } from 'sequelize';
require('dotenv').config();

/**
 * Connessione al DB sfruttando il pattern Singleton
 */
export class DB_Connection {
    private static instance: DB_Connection;
    private connection: Sequelize;

    private constructor() {
        this.connection = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
            dialect: 'postgres',
            host: process.env.PGHOST,
            port: Number(process.env.PGPORT),
            logging: false
        });
    }

    public static getInstance(): DB_Connection {
        if (!DB_Connection.instance) {
            DB_Connection.instance = new DB_Connection();
        }

        return DB_Connection.instance;
    }

    public getConnection() {
        return this.connection;
    }
}