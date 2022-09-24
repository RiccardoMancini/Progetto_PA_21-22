# Titolo: Sviluppo di un servizio back-end per la gestione di varie tipologie di aste 
Riccardo Mancini, Arment Pelivani.

## Obiettivi
Gli obiettivi del presente progetto, consistono nel realizzare un sistema back-end che permetta di implementare tre tipologie di aste differenti: asta inglese aperte, asta in busta chiusa e pagamento del prezzo più alto, asta in busta chiusa e pagamento del secondo prezzo più alto.
## Specifiche di progetto
- Le aste in busta aperta vengono implementate mediante websocket. I concorrenti sono in una stanza associati all'asta e si svolge attraverso un banditore che parte dal più basso prezzo accettabile, detto base d'asta, e che sollecita le offerte al rialzo fino a quando nessuna offerta viene superatada un altro compratore 
-	Per le aste in busta chiusa si prevede un meccanismo di protezione basato sulla generazione di almeno 5 coppie di chiavi pubbliche / private da usare nel seeding del DB. La cifratura avviene mediante la chiave pubblica.
Gli utenti che fanno l’offerta devono inviare, oltre al loro JWT nel body della richiesta, il valore di codifica in base 64 relativo al JSON contenente l’offerta
Un utente può fare solo una puntata per l’asta specifica
- (capire come scrivere la questione crypto)
## Specifiche sistema back-end
Il sistema deve prevedere la possibilità di:
-	Creare una nuova tipologia di asta 
-	Visualizzare l’elenco delle aste filtrando per non ancora aperte, in esecuzione, terminate
-	Opzionare / creare una nuova offerta per una data asta
-	Ogni utente deve gestire il suo credito sotto forma di token. All’atto di un “rilancio” / offerta, è necessario verificare la capienza dell’utente; se il credito non è disponibile allora la richiesta deve essere rifiutata
-	Dare la possibilità all’utente di verificare il proprio credito residuo
-	Visualizzare lo storico delle aste alle quali si è partecipato / si sta partecipando, listando tutti gli eventuali rilanci.
-	All’atto della aggiudicazione scalare il credito all’utente che risulta vincitore secondo la strategia dell’asta.
-	consentire ad un utente admin di ricaricare il credito un dato utente
-	Visualizzare lo storico delle aste alle quali si è partecipato distinguendo per quelle che sono state aggiudicate e non.
## Strumenti, framework e librerie utilizzate
-	Node.JS
-	Express
-	Sequelize
-	Postgres
-	Websocket con RxJS
-	Libreria crypto
-   Axios
-	Visual studio code
-	Docker
-	Postman
## Tipologie di richieste  possibili al sistema 

Tipologia | Rotta | Utente | Token JWT
--- | --- | --- | --- 
Get | /api/v1.0.0/aste | - | no
Get | /api/v1.0.0/storico/aste | bid_participant | si
Get | /api/v1.0.0/storico/aste/closed | bid_participant | si
Get | /api/v1.0.0/credito | bid_participant | si
Patch | /api/v1.0.0/admin/accredito | admin | si
Post | /api/v1.0.0/asta | bid_creator | si
Post | /api/v1.0.0/asta/offerta | bid_participant | si
Get | /asta/:asta_id/closed| - | -

## Descrizione delle singole rotte
#### 1) Elenco aste (/api/v1.0.0/aste)
Questo tipo di rotta è accessibile da qualsiasi utente e non richiede autorizzazioni. 
In questa rotta è possibile vedere l'elenco delle aste, e filtrarle in base al loro stato (1:"NON APERTA", 2:"IN ESECUZIONE" e 3:"TERMINATA").
L'operazione di filtraggio viene attuata tramite query string, nel seguente modo: `?stato=1`

#### 2) Elenco aste alla quale si è partecipato / si sta partecipando con rilanci/offerte (/api/v1.0.0/storico/aste)
Rotta accessibile solo al bid_participant e che necessita di una autenticazione JWT (di seguito un esempio valido).


#### 3) /api/v1.0.0/storico/aste/closed
#### 4) /api/v1.0.0/credito
#### 5) /api/v1.0.0/aste
#### /api/v1.0.0/asta
Rotta accessibile solo al bid_creator e che necessita di una autenticazione JWT (di seguito un esempio valido).
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6IkFybWVudCIsInJvbGUiOjJ9.TxhP0-moJwH2uZRx15bAKEC24ctdEyp5-M1hYbsljlA
```
Il bid_creator in questa rotta va creare una nuova asta mediante una operazione di post, inizializzando quelli che sono i parametri principali dell'asta, ovvero il tipo d'asta, la base d'asta, data di inizio e la data di fine.
Il tipo di asta è identificato mediante un codice numerico come riportato nella seguente tabella.
```
[1]  Asta inglese aperta   
[2]  Asta in busta chiusa e pagamento del prezzo più alto 
[3]  Asta in busta chiusa e pagamento del secondo prezzo più alto 
```
Le date inserite da parte del bid_creator sono sottoposte a diverse tipologie di controllo e validazione a seconda del tipo di asta, in quanto devono essere coerenti con quest'ultima e con la data di creazione dell'asta stessa.

Di seguito un esempio di come dovrebbe essere il body della richiesta:
```
{
    "tipo": 1,
    "p_min": 200,
    "data_i": "2022/09/24 15:00",
    "data_f": "2022/09/24 18:00"
}
```
La risposta, nel caso in cui passassero tutti i controlli, sarebbe:
```
{
    "messaggio": "Asta creata!"
}
```


##### Controllo date nella creazione dell'asta
- La base d'asta deve essere un tipo di dato numerico e strettamente maggiore di 0
- le data di inizio e di fine deve essere di tipo stringa e devono rispettare il seguente formato: `dd/mm/yyyy hh:tt` e `yyyy/mm/dd hh:tt`; (il separatore della data può essere sia "/" che "-", mentre il separatore del tempo deve essere ":")
- le date di inizio e di fine devono soddisfare la seguente relazione :
`data attuale ≤ data inizio asta < data fine asta`
- inoltre nell'asta inglese aperta il giorno, il mese e l'anno della data iniziale deve coincidere con quella finale.


#### /api/v1.0.0/asta/offerta
Rotta accessibile solo al bid_participant e che necessita di una autenticazione JWT (di seguito un esempio valido).
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlJpY2NhcmRvIiwicm9sZSI6M30.f7SVbExgWefAisbyRlD4b3XF-lCkCLR4L_PE71u0goo
```
Il bid_participant in questa rotta va creare una nuova offerta per una certa asta mediante una operazione di post, specificando l'id dell'asta e l'offerta.
L'id dell'asta viene validato verificando che sia di tipo numerico e successivamente che esista effettivamente quell'asta nello stato "IN ESECUZIONE".
Invece l'offerta viene controllata affinchè rispetti la seguente relazione:
`0 < base asta < offerta ≤ credito utente`

Di seguito un esempio di come dovrebbe essere il body della richiesta:
```
{
    "asta_id": 15,
    "offerta": 200
}
```
La risposta, nel caso in cui passassero tutti i controlli, sarebbe:
```
{
    "messaggio": "Offerta creata!"
}
```
DA FINIRE CON L'ASTA IN BUSTA CHIUSA

#### /storico/aste
A questa rotta vi accedono i bid_partecipant con autenticazione JWT per vedere lo storico delle aste a cui si sta partecipando e a cui si è partecipato. inoltre permette di vedere tutti i rilanci effettuati.
[esempio]
#### /storico/aste/chiuse
A questa rotta vi accedono i bid_partecipant con autenticazione JWT per vedere lo storico delle aste che ogni bid_participant si è aggiudicato o meno
[esempio]
#### /credito
Rotta che permette ai bid_partecipant con autenticazione JWT di visualizzare il credito residuo.
[esempio]

#### /admin/credito
Rotta che permette all'admin mediante autenticazione JVT di ricaricare il credito di un bid_partecipant.
Il sistema verifica se si hanno le autorizzazioni come Admin per effettuare l'accesso alla rotta.
## Pattern

#### Model-View-Controller
Il Model-View-controller è un tipo di pattern architetturale costituito da 3 elementi:
Il model, che, consente attraverso i suoi metodi specifici di accedere ai dati allocati nel database ed è stato implementato costruendo le seguenti componenti:
-	Utenti: modello che permette agli utenti di interagire direttamente con il sistema e ne definisce, l’identificativo, lo username, il nome, cognome, il ruolo e a seconda di quest’ultimo se ha un credito o meno.  
-	Partecipazione: modello che serve per tenere traccia degli utenti che possono interagire direttamente con il modello dell’asta  
-	Chiavi : modello che permette la decriptazione delle offerte delle aste in busta chiusa e ciascuna, è identificata da un parametro univoco
-	Asta: modello che va a definire quello che sono le variabili di stato che definisce ogni tipo di asta in maniera univoca(asta_id, tipo di asta, prezzo minimo di acquisto, data di inizio, data di fine, identificazione delle chiavi)  

Per quanto riguarda il modulo View, questo viene rappresentato dal framework Postman [Link ].

Il controller invece, permette, attraverso il View, di riceve le istruzioni da parte dell’utente e individuare le risorse nel model necessarie per completare la richiesta.

#### Proxy
Il Proxy è un design pattern, la cui classe condivide la stessa interfaccia dell'oggetto originale e di fatto gliele manda fornendo, con uno strato di astrazione in più, un livello tutto suo per validare i dati presenti nella medesima richiesta.
Un oggetto Proxy racchiude un altro oggetto e ne intercetta le operazioni e ha una sintassi del tipo

`let proxy = new Proxy(target, handler)`

•	target – è l’oggetto da racchiudere; può essere qualsiasi cosa, anche una funzione.
•	handler – configurazione del proxy: un oggetto con “trappole”, metodi che intercettano operazioni. Ad esempio una “trappola” get per la lettura di una proprietà di target, set per la scrittura di una proprietà di target, e così via.
In questo progetto  si sono sviluppati 4 Proxy specifici.
-	proxyAsta
-	proxyChiavi
-	proxyUtenti
-	proxyPartecipazione 
#### ProxyAsta
Il proxy aste viene utilizzato per effettuare la validazione dei parametri che vengono inseriti mediante body nella fase di creazione dell’asta.
Nello specifico, oltre a verificare la correttezza del tipo di dato, verifica anche la sua coerenza con gli altri parametri che devono essere analizzati, come ad esempio, la relazione che intercorre tra la data di inizio asta con la data di fine asta, e come queste due vadano verificate in modo differente a seconda del tipo di asta.
Le operazioni che esegue il proxyAste sono le seguenti:
-	Verifica la seguente relazione tra, la data di inizio asta, fine asta e data corrente per le aste inglesi dataCorrente ≤ dataIniziale < data finale. Se questo non è verificato viene lanciato un throw error

-	Per le altre tipologie di aste invece viene verificato che i parametri delle data rispettino la relazione dataCorrente ≤ dataIniziale ≤ data finale

-	Inoltre viene verificato che le date siano dei number di tipo intero e che la base d’asta sia un intero positivo.
Esempio parametri inseriti correttamente

#### ProxyUtente
Il proxyUtente, analogamente a quello asta,  viene utilizzato per effettuare la validazione dei parametri  inseriti mediante body nella fase di creazione del bid-paricipant.
Le operazioni che esegue il proxyUtente sono le seguenti:
-	Verifica che il credito del bid participant sia maggiore uguale di 1 e che sia di tipo numerico
-	Verifica che lo user_id sia di tipo numerico intero e che  sia maggiore uguale di 1
Esempio parametri inseriti correttamente
#### Chain of responsibility
Il Chain of responsability è un pattern comportamentale che permette di passare le richieste lungo una catena di handler (middleware), ognuno dei quali decide se processarla e passarla all'handler successivo (tramite next()), oppure sollevare un errore.
In questo progetto è stato usato:
- verificare la presenza e la correttezza dei token JWT; 
- autenticare gli utenti;
- gestire gli errori;
I middleware saranno agganciati direttamente alle rotte, e questo viene fatto per garantire che il controller processi delle richieste fatte da utenti con i giusti privilegi ed in caso sollevando le opportune eccezioni.

#### Singleton
Il singleton è un design pattern creazionale che ha lo scopo di garantire che di una determinata classe venga creata una e una sola istanza, e di fornire un punto di accesso globale a tale istanza.
Data la definizione appena fornita, il Singleton è stato utilizzato per la creazione di una e una sola connessione al data base.

#### Factory
Il Factory è un design pattern creazionale, che ha lo scopo di creare oggetti senza che ne venga specifica la classe esatta.
Nel presente progetto, il factory viene utilizzato nel contesto degli errori, quando essi vengono sollevati nel sistema. 
Nell'asta inglese è stato sviluppato un factory per lo scambio di messaggi  clients e server tramite websocket.

#### Builder
Il builder è un design pattern molto flessibile nella realizzazione di oggetti complessi, separandone la loro costruzione dalla rappresentazione. In questo progetto è stata implementata una classe "ObjectBuilder", utilizzata appunto per costruire ogni eventuale oggetto necessario ad ogni possibile esigenza; dal passaggio di tale oggetto come parametro dei vari metodi delle classi alla restituzione come risposta del controller.
#### Diagramma di sequenze

<img src = "jpg/OffertaAsta.jpg">

## Avvio del servizio
- spiegazone su come avviare il progetto

## Test
- allegare la collection di postman con la demo

## Autori

