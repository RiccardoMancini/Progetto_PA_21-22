const jwt = require('jsonwebtoken');
require('dotenv').config();
/** 
import * as sql from "sequelize";
import { SingletonDB } from "../model/Database";
import * as User from "../model/User";
*/

/**
 * {
 * "Name": "Name"
 * "role": 1
 * }
 */

/**
 * Check della presenza del parametro di autorizzazione
 *  
 * @param req richiesta
 * @param res risposta
 * @param next scorrimento nel midleware successivo
 */
export var checkHeader = (req,res,next) => {
    const authHeader = req.headers.authorization;
    if (authHeader)next();
    else res.status(401).send("Unauthorized");

};

/**
 * Funzione che fa il check della bearerHeader
 * 
 * @param req richiesta
 * @param res risposta
 * @param next scorrimento del midleware successivo
 */

export const checkToken = (req,res,next) => {

    const bearerHeader = req.headers.authorization;
        if(typeof bearerHeader!=='undefined'){ // controllo che esista bearerHeader
            const bearerToken = bearerHeader.split(' ')[1]; // mi prendo il token
            req.token = bearerToken;// mi salvo il token
            next();
        }
        else res.status(401);
};

/**
 * Funzione che verifica la correttezza del token JWT e decodifica il payload.
 * @param req 
 * @param res 
 * @param next 
 */

export const isAdmin = (req,res,next) => {
    let decoded = jwt.verify(req.token, process.env.SECRET_KEY);
    if(decoded !== null && typeof decoded.username === "string" || (decoded.role === "admin" || decoded.role === "bid_creator")) {
        next();
    }
    else res.status(401).send("Unauthorized");
}




