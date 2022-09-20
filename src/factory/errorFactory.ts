export class HttpError extends Error{
    message: string;
    status: number;
    
    constructor(message: string, status: number){
        super(message);
        this.message = message;
        this.status = status;
    }
}


class AstaNotCreate extends HttpError{
    constructor(){
        super('Creazione asta non riuscita', ErrEnum.BadRequest);
    }
    
}

class ElementNotFound extends HttpError{
    constructor(){
        super('Elemento non trovato!', ErrEnum.NotFound);
    }
}

class CreditoInsufficiente extends HttpError{
    constructor(){
        super('Credito insufficiente!', ErrEnum.BadRequest);
    }
}

class Unauthorized extends HttpError{
    constructor(){
        super('Non hai i permessi per accedere in questa sezione!', ErrEnum.Unauthorized);
    }
}

class BadRequest extends HttpError{
    constructor(){
        super('Richiesta non valida!', ErrEnum.BadRequest);
    }
    
}

class UtenteEsistente extends HttpError{
    constructor(){
        super('Id è già esistente', ErrEnum.BadRequest);
    }
    
}

export enum ErrEnum {
    BadRequest = 400,
    Unauthorized=401,
    NotFound = 404,
    InternalServerError = 500
}

export class ErrorFactory {
    constructor(){}
    getError (type:ErrEnum):HttpError{
        let retval:HttpError = null;
        switch (type){
            case ErrEnum.NotFound:
                retval = new ElementNotFound();
                break;    
            case ErrEnum.Unauthorized:
                retval = new Unauthorized();
                break;
            case ErrEnum.BadRequest:
                retval = new BadRequest();
                break;  
            default:
                break;              
        }
        return retval;
    }
}