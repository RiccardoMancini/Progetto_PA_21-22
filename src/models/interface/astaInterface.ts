export interface AstaInterface{

    getNotOpenAstaByID(asta_id: number): Promise<any|null>;
    getOpenAstaByID(asta_id: number): Promise<any|null>;
    getAste(): Promise<Array<any>>;
    updateAsta(asta: any): Promise<any>;
    createAsta(asta:string): Promise<any>;
}