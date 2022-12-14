CREATE DATABASE pa;
\c pa

CREATE TABLE Utenti(
    user_id SERIAL PRIMARY KEY,
    nome VARCHAR(30) NOT NULL,
    ruolo int NOT NULL,
    credito float8 NOT NULL
);

CREATE TABLE Chiavi (
    chiavi_id SERIAL PRIMARY KEY,
    public_key VARCHAR(1500) NOT NULL,
    private_key VARCHAR(1500) NOT NULL
);

CREATE TABLE Asta (
    asta_id SERIAL PRIMARY KEY,
    tipo int NOT NULL,
    p_min float8 NOT NULL,
    stato int NOT NULL,
    data_i TIMESTAMP NOT NULL,
    data_f TIMESTAMP NOT NULL,
    chiavi_id int,
    CONSTRAINT FK_Chiavi FOREIGN KEY (chiavi_id) REFERENCES Chiavi(chiavi_id) ON UPDATE CASCADE ON DELETE CASCADE
);


CREATE TABLE Partecipazione (
    part_id SERIAL PRIMARY KEY,
    user_id int NOT NULL,
    asta_id int NOT NULL,
    aggiudicata boolean NOT NULL,
    offerta float8 NOT NULL,
    CONSTRAINT FK_Utenti FOREIGN KEY (user_id) REFERENCES Utenti(user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT FK_Asta FOREIGN KEY (asta_id) REFERENCES Asta(asta_id) ON UPDATE CASCADE ON DELETE CASCADE
);

INSERT INTO Utenti (nome, ruolo, credito) VALUES
('Riccardo', 3, 1400), 
('Martina', 3, 500),
('Arment', 2, 999),
('admin', 1, 999),
('Pippo', 3, 700),
('Pluto', 3, 560);

INSERT INTO Chiavi (public_key, private_key) VALUES
('MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCjf2ba7J5z/7Lytk+N9GZcmVj/AbMxR/UO7VF+2v42QtlgUZKsrXzcv9a3QeWOnCBbMOxYyHs0WB9vFzjwC2tIRc7Ms5Bj8+DB5d2t7TOZStpuhti1UgP7JVUmf+YRqRTKRG6L/cB1tJzyPY3t3biL8J9rTmsWOgS0Zl1FAC661wIDAQAB', 'MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAKN/ZtrsnnP/svK2T430ZlyZWP8BszFH9Q7tUX7a/jZC2WBRkqytfNy/1rdB5Y6cIFsw7FjIezRYH28XOPALa0hFzsyzkGPz4MHl3a3tM5lK2m6G2LVSA/slVSZ/5hGpFMpEbov9wHW0nPI9je3duIvwn2tOaxY6BLRmXUUALrrXAgMBAAECgYEAltRSY8aECwkp4aT0UUXVJLnHE0FTOTRjy4h9dSS7/fy/oo6+XBSUKuXDRD5DcsNvShEhCGqy1kAxh3+J5FD0fzbQPd7nd5GPwUAxPOpvd89BzvdpkF9uSk3Gk8WtCb9egBJm68iZaiybThPpXscuHRMr63BaPga/T/YjcRGhLMkCQQDZhRMwYxX6fRwdRm10OF70CO3FJRpRkxqDEIE3QZZIOEYkb6hg4vVnZjFTECs9XRIaLd0BMDK5ijutKeBeaETzAkEAwGvMmH2qNZHSufNsTqMRurgfLDD7tms0ZWAkBM1Age0ApIhgDk4KakNhq1bh6T8gWoGikwD2UsFZry5F4eB7jQJAVi97Fe38tF5D+HmCPs1jGhA7naSA1BeUJqAwgqNTF1Rsvl0beyASGiEMpBvA9jRdStAnRCRDxO43jPoNs3pe7wJBALDUoDHnEjumpfQzKu5dV5azTBptbXTnskATiSZMhaKg7f1GQpgCyfl7sM8nyfZzB8WE6qWTtcq5WzTtHlWE2aUCQHUemtAEgRP7wbRgJa0r6+qWcjRoRppfcCp31gWgSKPi1XGtQyxNw5zd2aEqrivfiKddj8mEBDhKOS5f+x8JGNQ='),
('MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQClCnpTlZvoZ5SurkYmzhThDuNLEKUotlFHdDS9HhNEuWOTnjL9wOkHuoDnYHShAtgX/o8cMpCfNdykTbfGFqUZhuqmsvy60CPKv8s0oUnWEqajrekgqnxnij7d3vTj/4UOehS2Q9Ivbty14aIZYyM9w66XxR7ibuJYW09L8hnOTwIDAQAB', 'MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAKUKelOVm+hnlK6uRibOFOEO40sQpSi2UUd0NL0eE0S5Y5OeMv3A6Qe6gOdgdKEC2Bf+jxwykJ813KRNt8YWpRmG6qay/LrQI8q/yzShSdYSpqOt6SCqfGeKPt3e9OP/hQ56FLZD0i9u3LXhohljIz3DrpfFHuJu4lhbT0vyGc5PAgMBAAECgYBQaVF+hgdHbahAj8K4R3Je0T0nJr4Bnwrs8I59kji7JESC+PJJNoOTc2g404Mfq94TmsCpcW2LVNfi6cbfacsYX7Qf8cQ8qMovaB2iM4rJ83kZTv/73iUFcNHP0gsFkLPjjI2fU6DsXVx/tDOqztR2QiUJDOr+OVhCDeZnBhO9UQJBAPpOZw5cUdY10o/lIX3HbjM8GW2x0+N6BkwerWuVDur5IJMPv/oJsVXvm3LFhixnGIXW29/cVUahyr4USrP8GOkCQQCoy42tG4ELQZSHoa9MSx1VenTDg0XVWFgzUQBbK+Iqq7EYhEka0uxRFp/PoJbyJRdPiNWTRlvEnhJWz50otCp3AkEAhg7PqyVOv0d8So0RbugM4WviwplnPoHwNXyIrQHcR4S+KYVZ8HSYgcoem02nGsjsnWIByNec5INqrnr3t4XhYQJBAKU/olP2uT7r1R1zjMqEPxOP7v/5ZESZWL/kbRTUwXZE3/vAhlFcbT51h78c2Kn25ftXWr/0AaNbnVifqJxQxcECQQC/Ua6/+crSsbDHiAcNpbY3m0fcOSabSEL5Gp5IZ6NwaxP4quFi4p1WqbhgLdl9RE4rz84b5opgRNAX/pb7D4PH'),
('MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCXkBewHUzx7mX0dket6UQYJ/y+6hpAhXRiP/JOkx8bal45JVLxk/WR4tgvwTijN33wnZFZEPFwmHr/zJBqQglrx7VoviY5/CW9t4tO0ZSCpaLA9B4IGxzfjpj/QQUMtpI8neDlxuWng2DWApB4cmmT5SzXe79o+U7I0m08ooNZrQIDAQAB', 'MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAJeQF7AdTPHuZfR2R63pRBgn/L7qGkCFdGI/8k6THxtqXjklUvGT9ZHi2C/BOKM3ffCdkVkQ8XCYev/MkGpCCWvHtWi+Jjn8Jb23i07RlIKlosD0HggbHN+OmP9BBQy2kjyd4OXG5aeDYNYCkHhyaZPlLNd7v2j5TsjSbTyig1mtAgMBAAECgYEAheT1GE/6TuzmQz5O+rPNxW1mGp8kDAYaGEYX4RSV8ZlZnjB8AxFMa9I0XJPdXkvCxdPduQp/0ZHTb7Ifjs/CE4Yj4m6oZN8ougHOGu5eNLl5zofojbti3t4Nj8J2RFLB+uk6HFs6WwtA0FRZbxIgvtb2JbKIiGyeAoo2zQY20qECQQDmiWoaeCoBbGbsD7RR4/JTqVtB2zTLAgljvGZ1J8OonmoAEh8m+jnHIEOla5cHsb8lXS6fqe9Iq8Je30R7UKKpAkEAqE2i7psAtqMH9qIXNrAPLJh/Mn0GVIKzLeXBQjtSSoy7yDqYWcWB5ljQI09bgBxe3XVXFTFeBekm3G4Y2eLlZQJBAM2eIIGtTaHpYr8HnsgvbFKMSfWqIyMyFNfdEPFLXyrE6DxZ7WkhY2kkcNFY7eMR+S/FNbF4qxCBCaL+tiDaockCQBImBQrLxiDrpaEvy2cHRyuc6iJsnvEgAuhRHSziLraBRIKL5v/PL3nCW/diyFAhPw2MaK6NW0Ex6hHdAWsFb40CQQCSRCP7RXts6wEjoQRiyFho1W0ftz2rFxGRtCZT2lNWBQ+aLp/4FxE5B6NmmFRoOMBoOyDJGrzApr8Xo0/5ur9v'),
('MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDVfoXVP3kwTZEoxBWgww0zIDNfA5LhGahFPNw7Oi8GfuEB4OklaTLGDc/455tQsTpB5TNPKzeRabZ/HI/+ywR4O53WDAPKXJFRF7+0b2vFdR9NtiUsstR2OGxH2X6nvypz9QRRBEaSgo7eyWAacVOie6f+ALMlPyvXqJJLM0JVswIDAQAB', 'MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBANV+hdU/eTBNkSjEFaDDDTMgM18DkuEZqEU83Ds6LwZ+4QHg6SVpMsYNz/jnm1CxOkHlM08rN5Fptn8cj/7LBHg7ndYMA8pckVEXv7Rva8V1H022JSyy1HY4bEfZfqe/KnP1BFEERpKCjt7JYBpxU6J7p/4AsyU/K9eokkszQlWzAgMBAAECgYEAqc2Y6pQycm2vP6o9vYCFlh1NXou8HddHU9JlI6JSVqtBkTnulbfHD2la+ZBUouhi+pguqBAqgTiAUzdHfBLC+N2rRMwmsWOt6uZJdND8Doc5HLYa84WxXc22CR8v+H5SnMf8V1N6gu0v4wVz1vclQ2wf9zKPhKxaHmlI0nAb2ykCQQD2BNv1pyf7EjW81gvoNyizy2pR7bsCjDAQGi8efK5Gzm9GEX4muucBcZekcCcllhmYtLZrlUdEtmsKN6nk/LfvAkEA3ifc9iG2DHTTIQRUtxOISx/+/yTvcsdt6LDo1a4sz6bgGK2CZ6qCv0g7GaWgRVmE0CwwmZ3l2065gegj0XXafQJARmG7f7qzgGuEPiLKQ0PMfCtcnlWxo5fxhBnJkyI+RXl3cgc9HN1piwsxQ9TmDiWz6vEAIyUQv4KkesbT7vOxtwJAPln94G8Rw2k+oLOweznWNQ+j6ESbmCF1LawJjX+3QAjcONDqGuJ2k+1X+RjNZOl9J1hfw53Xl7f+xQE8nFtxmQJBAO4mtu2FgXPaF/FvnMLiFv2LPyCukEzJDgsd4M1wTWJ5D7HO2rjD7MO4uY0eSP2vcBYY9Q7US0avwALVmmROW9Q='),
('MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCqPlUSB4JnWTIzVO2iaHGotUxR39A/XUW/Z+/yS5UZB0134ooGO64HSXje45/WCvEX8SE8m/w2SqrS5D818oNLNv0ppGgwxp9sbL+o5iMaTI5t/2Q2bbrUEhFg9U4mY6TmpdgnQjyST6QEdkMM3PgfW9Pm7eWbj94ul6tRIyeDpwIDAQAB', 'MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAKo+VRIHgmdZMjNU7aJocai1TFHf0D9dRb9n7/JLlRkHTXfiigY7rgdJeN7jn9YK8RfxITyb/DZKqtLkPzXyg0s2/SmkaDDGn2xsv6jmIxpMjm3/ZDZtutQSEWD1TiZjpOal2CdCPJJPpAR2Qwzc+B9b0+bt5ZuP3i6Xq1EjJ4OnAgMBAAECgYBJvMnYD0yaOvYVabmr2JUyP6SY6donN90X9IrnZXlk59bUEFk8LelI2rfxwqHeccrPVe/RcrahRWIMCjSexzW6S+9xYY97LBv7+VcoLRo51xg+eAj/m4qYy4OU4jonG6FjDQiqtM5121v5VQUIqNS0NwXq2Ld0aHjG8j27f1afgQJBAP42PuRsPLidEa/gwW0Eo3Am/Zcsu9qyu1iCBubkmTBXtOZt4iHopLUUvNrkYT4H4TB7I60U2lC7Cpouq4Qyx0cCQQCrcOLprZf/TG6RDGqCkRlvYyZz35sABxn8hzamudcsHkq1C93L9T7hX+0bJBthNA2B/t3/Fe9U/MyOLJCUflChAkBQvE2xIicOwuOxJgKIaya1Icz8TDrFNGqHq5QhlIyKa/CKFm/xMP/Oeu2X31x65OnCCfnEqJDFfwHZAeV7MN1VAkEAje7iXVWzXc/4RauCzl+0MAxk/E9l8oruj6udqkB3DHZzoRmW4VFDYrDZCrxE0p+Wg0Xuok2Vm8XCz/3DILzGoQJBAKn3PxmlRRhhaM9ydNBSoV3FZhdIJ/89X6DLRftPRyenL/EAkhCcKrkd2m+g2S/sgx/uGZZFO22M3mc4y79ppvE=');

INSERT INTO Asta (tipo, p_min, stato, data_i, data_f, chiavi_id) VALUES
(2, 150, 2, '2020-12-15', '2020-12-17', 2),
(3, 100, 2, '2021-11-13', '2021-12-13', 4),
(2, 500, 1, '2022-06-27', '2022-12-17', 5),
(1, 200, 2, '2021-11-14', '2021-12-15', null),
(1, 200, 3, '2021-11-11', '2021-12-15', 1),
(3, 150, 2, '2021-09-27', '2021-09-29', 1),
(2, 250, 2, '2022-10-18', '2022-10-22', 3);

INSERT INTO Partecipazione (user_id, asta_id, aggiudicata, offerta) VALUES
(2, 5, FALSE, 40),
(5, 1, FALSE, 155),
(1, 2, FALSE, 150),
(6, 2, FALSE, 140),
(5, 4, FALSE, 205),
(2, 5, TRUE, 20),
(2, 1, FALSE, 160),
(1, 4, FALSE, 210),
(1, 4, FALSE, 240),
(1, 4, FALSE, 260),
(1, 4, FALSE, 350),
(2, 4, FALSE, 220),
(2, 4, FALSE, 230),
(1, 1, FALSE, 220),
(6, 1, FALSE, 180),
(2, 4, FALSE, 250),
(6, 4, FALSE, 280),
(2, 4, FALSE, 320),
(2, 2, FALSE, 105),
(5, 2, FALSE, 160);