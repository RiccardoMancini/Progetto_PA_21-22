import jwt from 'jsonwebtoken';
require('dotenv').config();

/**
 * Check della presenza del parametro di autorizzazione
 *  
 * @param req richiesta
 * @param res risposta
 * @param next scorrimento nel midleware successivo
 */
export const checkHeader = (req,res,next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) next();
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
        else res.status(401).send('Undefined');
};






