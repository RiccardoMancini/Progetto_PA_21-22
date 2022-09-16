import { ResponseHttp} from './response';
/**
 * Classe utilizzata per comporre la risposta da inviare all'utente
 */
export class ResponseBuilder{
    private stato:string;
    private codice_di_stato:number;
    private messaggio:string;
    private data:any;

    constructor(){

    }
    //Si settano i dati
    setData(data:any){
        this.data = data;
        return this;
    }
    //Si settano i dati della risposta 
    setStatus(stato:string){
        this.stato = stato;
        return this;
    }
    //Si setta il Messaggio di risposta
    setMessage(messaggio:string){
        this.messaggio = messaggio;
        return this;
    }
    //Si setta il codice dello stato della risposta HTTP
    setStatusCode(codice_di_stato:number){
        this.codice_di_stato = codice_di_stato;
        return this;
    }
    //Getter dello status
    getStatus():string{
        return this.stato;
    }
    //Getter del codice dello stato
    getStatus_code():number{
        return this.codice_di_stato;
    }
    //Getter del messaggio di risposta HTTP
    getMessage():string{
        return this.messaggio;
    }
    //Getter dei dati
    getData():any{
        return this.data;
    }
    //Costruisce l'oggetto
    build() {
        return new ResponseHttp(this);
    }
}