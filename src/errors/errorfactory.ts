class HttpError extends Error{
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

class UtenteNonTrovato extends HttpError{
    constructor(){
        super('Utente non trovato!', ErrEnum.NotFound);
    }
}

class AstaNonTrovata extends HttpError{
    constructor(){
        super('Asta non trovata!', ErrEnum.NotFound);
    }
}
class CreditoInsufficiente extends HttpError{
    constructor(){
        super('Credito insufficiente!', ErrEnum.BadRequest);
    }
}

class UtenteNonAutorizzato extends HttpError{
    constructor(){
        super('Non hai i permessi per accedere in questa sezione', ErrEnum.Unauthorized);
    }
}

class TokenNonValido extends HttpError{
    constructor(){
        super('Il token inserito non è valido', ErrEnum.BadRequest);
    }
    
}

class AssenzaHeader extends HttpError{
    constructor(){
        super('Header assente', ErrEnum.BadRequest);
    }
    
}

class UtenteEsistente extends HttpError{
    constructor(){
        super('Id è già esistente', ErrEnum.BadRequest);
    }
    
}

export enum ErrEnum {
    None = 0,
    BadRequest = 400,
    Unauthorized=401,
    NotFound = 404
}

export class ErrorFactory {
    constructor(){}
    getError (type:ErrEnum):HttpError{
        let retval:HttpError = null;
        switch (type){
            case ErrEnum.NotFound:
                retval = new NotFound();
                break;    
            case ErrEnum.Unauthorized:
                retval = new Unauthorized();
                break;
            case ErrEnum.BadRequest:
                retval = new BadRequest();
                break;                
        }
        return retval;
    }
}