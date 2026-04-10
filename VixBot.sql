create database VixBot

use VixBot
go

create table BannedWords (
ID int identity primary key not null,
Words varchar(40) not null,
)