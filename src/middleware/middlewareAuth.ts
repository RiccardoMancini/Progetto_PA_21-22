import jwt from 'jsonwebtoken';
require('dotenv').config();

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


export const verifyAndAuthenticate = (req,res,next) => {
    try{
        let decoded = jwt.verify(req.token, process.env.SECRET_KEY);
        if(decoded !== null){
            if(decoded.role === 1 || decoded.role === 2 || decoded.role === 3){
                req.user_id = decoded.id;                
                next();
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