--create database VixBot

use VixBot
go

--create table BannedWords (
--ID int identity primary key not null,
--Words varchar(40) not null,
--)

insert into BannedWords (Words) values
('http://'), ('https://'), ('www.'),
('.com'),('.net'),('.org'),
('puto'), ('puta'), ('pvto'),
('pvta'), ('pvt0'), ('pvt4'),
('pvt@'), ('pvt4'), ('pvt4'),
('pvt4');