export interface PartecipazioneInterface{

    getClosedAsteByUserID(user_id: number, date_i?: string | Date, date_f?: string | Date): Promise<Array<any>>;
    getAsteByUserID(user_id: number): Promise<Array<any>>;
    getFirstOfferByAstaID(asta_id: number): Promise<any|null>;
    getOffersByAstaID(asta_id: number): Promise<any>;
    updatePartecipazione(part: any): Promise<any>;
    setOffer(...payload:any): Promise<any>;
    deleteOffer(part_id: number): Promise<any>;
    getOffersByUserAstaID(user_id: number, asta_id:number): Promise<Array<any>>;

}