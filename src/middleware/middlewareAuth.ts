import jwt from 'jsonwebtoken';
require('dotenv').config();

enum role{
    ADMIN = 1,
    BID_CREATOR = 2,
    BID_PARTICIPANT = 3
}

/**
 * Check della presenza del parametro di autorizzazione
 */
export const checkHeader = (req,res,next) => {
    const aHeader = req.headers.authorization;
    if (aHeader) next();
    else res.status(400).send('Bad request');

};

/**
 * Funzione che fa il check della bearerHeader
 */
export const checkToken = (req,res,next) => {

    const bearerHeader = req.headers.authorization;
    //console.log(bearerHeader)
        if(typeof bearerHeader!=='undefined'){
            const bearerToken = bearerHeader.split(' ')[1];
            req.token = bearerToken;
            
            next();
        }
        else res.status(400).send('Bad request');
};

/**
 * Funzione che verifica l'admin
 */
export const isAdmin = (req,res,next) => {
    let decoded = jwt.verify(req.token, process.env.SECRET_KEY);    
    if(decoded !== null && (decoded.role === role.ADMIN)){
        next();
    }
    else res.status(401).send("Unauthorized");
}

/**
 * Funzione che verifica il BidCreator
 */
 export const isBidCreator = (req,res,next) => {
    let decoded = jwt.verify(req.token, process.env.SECRET_KEY);    
    if(decoded !== null && (decoded.role === role.BID_CREATOR)){
        next();
    }
    else res.status(401).send("Unauthorized");
}

/**
 * Funzione che verifica BidParticipant 
 */
export const isBidParticipant = (req,res,next) => {
    let decoded = jwt.verify(req.token, process.env.SECRET_KEY);    
    if(decoded !== null && (decoded.role === role.BID_PARTICIPANT)) {
        req.user_id = decoded.id;
        next();
    }
    else res.status(401).send("Unauthorized");
}