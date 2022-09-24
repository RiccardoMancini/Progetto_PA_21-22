/**
 * Funzione che restituisce casualmente una coppia di chiavi
 * tra quelle passate come parametro
 * @param rawKeys elenco di coppie di chiavi pubbliche / private
 * @returns una coppia di chiavi
 */
 export function getRandomKey(rawKeys: any): any{    
    const arrKey: any = rawKeys.map(elem => elem.chiavi_id)
    let indice: number = Math.round(Math.random() * (arrKey.length - 1));
    return arrKey[indice];
}

/**
 * Funzione che verifica se la data passata come parametro
 * è già trascorsa o meno rispetto ad ora
 * @param data data da verificare
 * @returns true se la data è già trascorsa, false altrimenti 
 */
export function checkDataAsta(data: Date): boolean{
    const now: Date = new Date(Date.now());
    //console.log(now.toISOString(), data, now > data)
    return now > data ? true : false
}

/**
 * Funzione che verifica se la stringa passata come parametro
 * rispetta la codifica base64
 * @param offerCripted stringa codificata
 * @returns true se è correttamente codificata, false altrimenti
 */
export function checkCode64Offer(offerCripted: string): boolean{
    const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    return base64regex.test(offerCripted) ? true : false;

}


/**
 * Funzione che permette di verificare se una stringa definisce
 * ora e minuti nel formato hh:tt
 * @param time stringa da validare
 * @returns se corretta, array costituito dall'elemento ora e dall'elemento minuti
 * altrimenti false
 */
export function checkTime(time: string): Array<string> | boolean{
    const re = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;
    if(re.test(time) && time.includes(':')){
        return time.split(':');
    }
    else{
        return false;
    }
}

/**
 * Funzione che verifica se due date sono lo stesso giorno
 * @param first prima data
 * @param second seconda data
 * @returns true se corrispondo, false altrimenti
 */
export function datesAreOnSameDay(first: Date, second: Date): boolean{
    return (first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate());
}

/**
 * Funzione necessaria per validare una data
 * @param date data da validare passata come stringa
 * @returns se è valida restituisce la data come oggetto Date,
 * false altrimenti
 */
export function checkDate(date: string): Date | boolean{
    const re1 = /^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}$/;
    const re2 = /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/;
    if((re1.test(date) || re2.test(date))){        
        //Verifica del separatore utilizzato
        let opera1 = date.split('/');
        let opera2 = date.split('-');
        let lopera1 = opera1.length;
        let lopera2 = opera2.length;
        if (lopera1>1){
            var pdate = date.split('/');
        }
        else if (lopera2>1){
            var pdate = date.split('-');
        }
        // Assegnazione giorno, mese ed anno dalla stringa
        if(re1.test(date)){
            var dd = parseInt(pdate[0]);
            var yy = parseInt(pdate[2]);
        }
        else{
            var dd = parseInt(pdate[2]);
            var yy = parseInt(pdate[0]);
        }
        
        var mm  = parseInt(pdate[1]);
        
        var ListofDays = [31,28,31,30,31,30,31,31,30,31,30,31];
        if (mm === 1 || mm > 2){
            if (dd > ListofDays[mm - 1]){
                return false;
            }
        }
        if (mm == 2){
        var lyear = false;
            // verifica anno bisestile
            if ( (!(yy % 4) && yy % 100) || !(yy % 400)){
                lyear = true;
            }
            if ((lyear==false) && (dd >= 29)){
                return false;
            }
            if ((lyear==true) && (dd > 29)){
                return false;
            }
        }
        return new Date(yy, mm-1, dd);
    }
    else{
        return false;
    }
}