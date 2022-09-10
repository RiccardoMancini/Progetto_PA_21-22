CREATE DATABASE pa;
\c pa

CREATE TABLE Utenti(
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    nome VARCHAR(30) NOT NULL,
    cognome VARCHAR(30) NOT NULL,
    ruolo int NOT NULL,
    credito int NOT NULL
);

CREATE TABLE Chiavi (
    chiavi_id SERIAL PRIMARY KEY,
    public_key VARCHAR(50) NOT NULL,
    private_key VARCHAR(50) NOT NULL
);

CREATE TABLE Asta (
    asta_id SERIAL PRIMARY KEY,
    tipo int NOT NULL,
    p_min int NOT NULL,
    stato int NOT NULL,
    data_i date NOT NULL,
    data_f date NOT NULL,
    chiavi_id int,
    CONSTRAINT FK_Chiavi FOREIGN KEY (chiavi_id) REFERENCES Chiavi(chiavi_id) ON UPDATE CASCADE ON DELETE CASCADE
);


CREATE TABLE Partecipazione (
    part_id SERIAL PRIMARY KEY,
    user_id int NOT NULL,
    asta_id int NOT NULL,
    aggiudicata boolean NOT NULL,
    offerta int NOT NULL,
    CONSTRAINT FK_Utenti FOREIGN KEY (user_id) REFERENCES Utenti(user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT FK_Asta FOREIGN KEY (asta_id) REFERENCES Asta(asta_id) ON UPDATE CASCADE ON DELETE CASCADE
);

INSERT INTO Utenti (username, nome, cognome, ruolo, credito) VALUES
('richymanci', 'Riccardo', 'Mancini', 2, 50), 
('marti_pa', 'Martina', 'Paoletti', 3, 0),
('arme_peliv', 'Arment', 'Pelivani', 2, 70),
('admin', 'AD', 'MIN', 1, 999),
('pippo', 'Pippo', 'Pallino', 3, 25),
('prova', 'Pippo', 'Pallino', 3, 15);

INSERT INTO Asta (tipo, p_min, stato, data_i, data_f) VALUES
(2, 15, 3, '2020-12-15', '2020-12-17'),
(3, 10, 3, '2021-11-13', '2021-12-13'),
(2, 50, 1, '2022-06-27', '2022-12-17');

INSERT INTO Partecipazione (user_id, asta_id, aggiudicata, offerta) VALUES
(2, 2, FALSE, 40),
(5, 1, TRUE, 20),
(1, 2, FALSE, 15),
(6, 2, FALSE, 15);