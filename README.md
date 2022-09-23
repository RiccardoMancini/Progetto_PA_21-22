# Sviluppo di un back-end per la gestione di varie tipologie di aste

## Obiettivi
Gli obiettivi del presente progetto, consistono nel realizzare un sistema back-end che permetta di implementare tre tipologie di aste differenti: asta inglese aperta, asta in busta chiusa e pagamento del prezzo più alto, asta in busta chiusa e pagamento del secondo prezzo più alto. Gli utenti che potranno utilizzare il back-end e, che di conseguenza potranno interagire con le aste prima elencate, saranno: 
- Bid participant, ossia utenti che possono partecipare, effettuando offerte a tutte le tipologie di asta, e che potranno direttamente interagire con il loro "credito" e lo storico delle loro partecipazioni e offerte;
- Bid creator, ossia gli utenti che si occupano di fatto di creare nuove aste;
- Admin, ossia è l'utente che in questo contesto si occupa solamente di ricaricare gli altri utenti;
## Specifiche di progetto
- Le aste inglesi aperte vengono implementate mediante la tecnologia WebSocket. I concorrenti (clients) sono di fatto connessi nella stessa stanza associata all'asta di riferimento (server). A questo punto, l'interazione tra di essi si svolge attraverso un banditore che parte dal più basso prezzo accettabile, detto base d'asta, e che sollecita le offerte al rialzo fino a quando nessuna offerta viene superata da un altro compratore.
-	Per le aste in busta chiusa invece, si prevede un meccanismo di protezione basato sull'assegnazione ad ogni nuova asta di uno coppia di chiavi (chiave pubblica - privata). Gli utenti che fanno l’offerta devono inviare, oltre al loro JWT nel body della richiesta, il valore di codifica in base 64 relativo al JSON contenente l’offerta. Tale offerta dovrà essere codificata con la stessa chiave pubblica associata all'asta alla quale si vuole fare l'offerta; cosicchè alla ricezione della richiesta, il back-end sarà in grado di decodificare tale offerta con la giusta chiave privata. Ovviamente per questa tipologia di asta, a differenza della precedente, un utente può fare solo una puntata per ogni asta.
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
-	[Node.JS](https://nodejs.org/en/docs/)
-	[Express](https://expressjs.com/it/4x/api.html)
-	[Sequelize](https://sequelize.org/api/v6/identifiers)
-	[PostgreSQL](https://www.postgresql.org/docs/)
-	[Websocket con RxJS](https://rxjs.dev/api/webSocket/webSocket)
-	[Libreria crypto](https://nodejs.org/api/crypto.html)
- [Axios](https://axios-http.com/docs/intro)
-	[Visual Studio Code](https://code.visualstudio.com/)
-	[Docker](https://www.docker.com/)
-	[Postman](https://www.postman.com/)

## Tipologie di richieste  possibili al sistema 

Tipologia | Rotta | Utente | Token JWT
--- | --- | --- | --- 
Get | /aste | - | -
Get | /asta/new|bid_creator| bid_creator | si
Get | /asta/asta_id/closed| - | -
Get | /storico/aste/chiuse| bid_partecipant | si
Get | /credito| bid_partecipant | si
Get | /storico/aste/chiuse| bid_partecipant | si
Patch | /admin/credito | admin | si

## Descrizione delle singole rotte
#### /aste
Questo tipo di rotta è accessibile da qualsiasi utente e non richiede autorizzazioni. 
In questa rotta è possibile vedere l'elenco delle aste, e filtrare in base a se è aperta, in esecuzione oppure terminata.
[Esempi output]

#### /asta/new
Rotta che è accessibile solo al bid_creator e che necessiata di una autenticazione JWT.
Il bid_creator in questa rotta va creare una nuova asta mediandte una operazione di post, inizializzando quelle che sono le variabili di stato dell' asta, ovvero il tipo d'asta, la base d' asta, data di inizio e la data di fine.
Il tipo di asta è identificato mediante un codice numerico come riportato nella seguente tabella.
```
[1]  Asta inglese aperta   
[2]  Asta in busta chiusa e pagamento del prezzo più alto 
[3]  Asta in busta chiusa e pagamento del secondo prezzo più alto 
```
Le date inserite da parte del bid_creator sono sottoposte a diverse tipologie di controllo a seconda del tipo di asta in qunato devono essere coerenti con quest'ultima e con la data di creazione dell'asta stessa.
##### Controllo nella asta inglese aperta
- La base d'asta deve essere un tipo di dato numerico e strettamente maggiore di 0
- le data di inizio e di fine deve essere di tipo numerico e intere 
- le date di inizio e di fine devono soddisfareq la seguente relazione 
`data attuale ≤ data inizio asta < data fine asta`

##### Controllo nelle altre tipologie di aste
- La base d'asta deve essere un tipo di dato numerico e strettamente maggiore di 0
- le data di inizio e di fine deve essere di tipo numerico e intere 
- le date di inizio e di fine devono soddisfare la seguente relazione 
`data attuale ≤ data inizio asta ≤ data fine asta`

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

Per quanto riguarda il modulo View, questo viene rappresentato dalla piattaforma [Postman](https://www.postman.com/).

Il controller invece, permette, attraverso il View, di riceve le istruzioni da parte dell’utente e individuare le risorse nel model necessarie per completare la richiesta.

#### Proxy
Il Proxy è un design pattern, la cui classe condivide la stessa interfaccia dell'oggetto originale e di fatto gliele manda fornendo, con uno strato di astrazione in più, un livello tutto suo per validare i dati presenti nella medesima richiesta.
Un oggetto Proxy racchiude un altro oggetto e ne intercetta le operazioni e ha una sintassi del tipo

`let proxy = new Proxy(target, handler)`

•	target – è l’oggetto da racchiudere; può essere qualsiasi cosa, anche una funzione.
•	handler – configurazione del proxy: un oggetto con “trappole”, metodi che intercettano operazioni. Ad esempio una “trappola” get per la lettura di una proprietà di target, set per la scrittura di una proprietà di target, e così via.
In questo progetto  si sono sviluppati 4 Proxy specifici.
-	ProxyAsta
-	ProxyChiavi
-	ProxyUtenti
-	ProxyPartecipazione 

##### ProxyAsta
Il proxy asta viene utilizzato per effettuare la validazione dei parametri che vengono passati mediante le richieste, per poterle poi inoltrare al modello asta. Tra le operazioni che vengono richieste a quest'ultimo modello, la creazione di una nuova asta è di sicuro la più complessa da validare.
Nello specifico, oltre a verificare la correttezza dei vari dati passati, verifica anche la loro coerenza con gli altri parametri che devono essere analizzati, come ad esempio, la relazione che intercorre tra la data di inizio asta con la data di fine asta, e come queste due vadano verificate in modo differente a seconda del tipo di asta.

##### ProxyUtente
Il proxy utente, analogamente a quello asta, andrà a validare i dati che vengono passati mediante le richieste, per poi passarle al modello utente.
Le principali operazioni di validazioni sono fondamentalmente quelle sul check del credito passato dall'admin per ricaricare un altro utente e sull'effettiva esistenza di quest'ultimo.

##### ProxyPartecipazione
Il proxy partecipazione va a validare le richieste che gli arrivano e le inoltre direttamente al modello partecipazione.
Anch'esso si preoccuperà di verificare la correttezza dei parametri passati come le date e le nuove offerte effettuate da parte dei bid participant.

##### ProxyChiavi
Il proxy chiavi, non ha alcun compito di validazione, in quanto nel presente contesto le chiavi pubbliche e private sono già presenti all'interno del database. Per questo motivo si occuperà solamente di richiedere l'elenco delle chiavi al suo omonimo modello per poi poterle restituire al controllor qualora venissero richieste.

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

## Avvio del servizio
- spiegazone su come avviare il progetto

## Test
- allegare la collection di postman con la demo

## Autori
- [Riccardo Mancini](https://github.com/RiccardoMancini)
- [Arment Pelivani](https://github.com/armentpelivani)
