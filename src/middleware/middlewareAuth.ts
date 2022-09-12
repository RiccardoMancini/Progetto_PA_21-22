import jwt from 'jsonwebtoken';
require('dotenv').config();

/**
 * Check della presenza del parametro di autorizzazione
 */
export const checkHeader = (req,res,next) => {
    const aHeader = req.headers.authorization;
    if (aHeader) next();
    else res.status(401).send("Unauthorized");

};

/**
 * Funzione che fa il check della bearerHeader
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

/**
 * Funzione che verifica il BidCreator
 */


export const isBidCreator = (req,res,next) => {
    let decoded = jwt.verify(req.token, process.env.SECRET_KEY);    
    if(decoded !== null && typeof decoded.username === "string" && (decoded.role === 1)){
        console.log(decoded)
        next();
    }
    else res.status(401).send("Unauthorized");
}

/**
 * Funzione che verifica l'admin
 */

export const isAdmin = (req,res,next) => {
    let decoded = jwt.verify(req.token, process.env.SECRET_KEY);    
    if(decoded !== null && typeof decoded.username === "string" && (decoded.role === 2)){
        console.log(decoded)
        next();
    }
    else res.status(401).send("Unauthorized");
}

/**
 * Funzione che verifica BidParticipant 
 */

export const isBidParticipant = (req,res,next) => {
    let decoded = jwt.verify(req.token, process.env.SECRET_KEY);    
    if(decoded !== null && typeof decoded.username === "string" && (decoded.role === 3)) {
        console.log(decoded)
        next();
    }
    else res.status(401).send("Unauthorized");
}