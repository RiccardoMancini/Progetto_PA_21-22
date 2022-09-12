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

export const verifyAndAuthenticate = (req,res,next) => {
    try{
        let decoded = jwt.verify(req.token, process.env.SECRET_KEY);
        if(decoded !== null){
            if((decoded.role === "admin" || 
                decoded.role === "bid_partecipant" || 
                decoded.role === "bid_creator") &&
                typeof decoded.username === "string"){
                 req.user = decoded.username
                 next()
            } else {
                //DA GESTIRE CON L'ERROR HANDLER
                res.status(500).send('No permessi')
            }
        }else{
            res.status(500).send('Errore di firma')
        }
    }catch(error){
        console.log('Sono nel catch!')
    }
};

/**
 * Funzione che verifica la correttezza del token JWT e decodifica il payload.
 * @param req 
 * @param res 
 * @param next 
 */
export const isBidCreator = (req,res,next) => {
    let decoded = jwt.verify(req.token, process.env.SECRET_KEY);    
    if(decoded !== null && typeof decoded.username === "string" && (decoded.role === 1 || decoded.role === 2)) {
        console.log(decoded)
        next();
    }
    else res.status(401).send("Unauthorized");
}




