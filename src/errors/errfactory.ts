export class Risposta{
    private cod_stato: number;
    private stato: String;
    private messaggio: String; 

    constructor(){};

    setStato (stato:String){
        this.stato = stato;
        return this;
    }
    setCodStato (cod_stato:number){
        this.cod_stato = cod_stato;
        return this;
    }
    setMessaggio (messaggio:String){
        this.messaggio = messaggio;
        return this;
    }

    getStato ():String{
        return this.stato;
    }
    getCodStato ():number{
        return this.cod_stato;
    }
    getMessaggio ():String{
        return this.messaggio;
    }

}