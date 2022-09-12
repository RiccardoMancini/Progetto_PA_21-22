class HttpError extends Error{
    message: string;
    status: number;
    
    constructor(message: string, status: number){
        super(message);
        this.message = message;
        this.status = status;
    }
}

class UtenteNonVerificato extends HttpError{
    constructor(){
        super('Utente non verificato', ErrEnum.BadRequest);
    }
    
}

class HeaderAssente extends HttpError{
    constructor(){
        super('Header non presente ', ErrEnum.BadRequest);
    }
    
}

class ErrToken extends HttpError{
    constructor(){
        super('Element not found!', ErrEnum.NotFound);
    }
}

export enum ErrEnum {
    None = 0,
    BadRequest = 400,
    NotFound = 404
}

export class ErrorFactory {
    constructor(){}
    getError (type:ErrEnum):HttpError{
        let retval:HttpError = null;
        switch (type){
            case ErrEnum.NotFound:
                retval = new ();
                break;
            case ErrEnum.BadRequest:
                retval = new BadRequest();
                break; 
                               
        }
        return retval;
    }
}