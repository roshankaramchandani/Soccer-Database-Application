CREATE TABLE Country(ID integer primary key,name varchar(100) NOT NULL,Flag text);

CREATE TABLE Club(ID integer primary key,name varchar(100) NOT NULL,Flag text);

CREATE TABLE Club_Country(ID integer PRIMARY KEY, Country_ID integer, Club_ID integer, foreign key (Country_ID) references Country(ID), foreign key (Club_ID) references Club(ID));


CREATE TABLE Players(ID integer PRIMARY KEY,
					 Country_ID integer,Club_ID integer,Name varchar(100) NOT NULL, 
					 Wage NUMERIC, Age integer, Photo TEXT,Repuatation integer DEFAULT 0,Jersey_Number integer,
					 Posotion varchar(10),Height integer not null,Weight integer not null, 
					foreign key (Country_ID) references Country(ID), foreign key (Club_ID) references Club(ID));					
					
CREATE TABLE Contracts(ID INTEGER PRIMARY KEY, Player_ID INTEGER ,Club_ID INTEGER, 
					   Value NUMERIC NOT NULL, Loaned_from varchar(100),
					   Joined_date DATE,End_Date DATE,Release_clause NUMERIC,foreign key (Club_ID) references Club(ID),
					  foreign key (Player_ID) references Players(ID));	


CREATE TABLE Goalkeeping_rating(ID INTEGER PRIMARY KEY, Player_ID INTEGER,
					   Diving integer not null default 70,
					   Handling integer not null default 70,
					   Goal_kick integer not null default 70,
					   Positioning integer not null default 70,
					   Reflexes integer not null default 70,
					  foreign key (Player_ID) references Players(ID));										  
					  

CREATE TABLE Defensive_skills_rating(ID INTEGER PRIMARY KEY, Player_ID INTEGER,
					   Defensive_awareness integer not null default 70,
					   Standing_tackle integer not null default 70,
						Sliding_tackle integer not null default 70,			 
					   Strength integer not null default 70,
					   Speed integer not null default 70,
					   Aggression integer not null default 70,
					   Interception integer not null default 70,
					  foreign key (Player_ID) references Players(ID));					


CREATE TABLE Offensive_skills_rating(ID INTEGER PRIMARY KEY, Player_ID INTEGER,
					   Crossing integer not null default 70,
					   Finishing integer not null default 70,
						Heading_accuracy integer not null default 70,			 
					   Volleys integer not null default 70,
					   Dribbling integer not null default 70,
					   Short_pass integer not null default 70,
					   Long_pass integer not null default 70,
						Free_kick integer not null default 70,
						Penalties integer not null default 70,
						Long_shots integer not null default 70,
						Jump integer not null default 70,			 
					  foreign key (Player_ID) references Players(ID));										  