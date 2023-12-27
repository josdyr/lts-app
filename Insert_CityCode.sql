SELECT * FROM [dbo].[CityCodes]

DELETE FROM [dbo].[CityCodes]

DBCC CHECKIDENT ('CityCodes', RESEED, 0);

INSERT INTO [dbo].[CityCodes] (City, Code)
VALUES
('Arendal', 'AG'),
('Farsund', 'AG'),
('Flekkefjord', 'AG'),
('Grimstad', 'AG'),
('Kristiansand', 'AG'),
('Lillesand', 'AG'),
-- ('Mandal', 'AG'),
('Risør', 'AG'),
('Tvedestrand', 'AG'),
('Gjøvik', 'IL'),
('Hamar', 'IL'),
('Kongsvinger', 'IL'),
('Lillehammer', 'IL'),
('Kristiansund', 'MR'),
('Molde', 'MR'),
('Ålesund', 'MR'),
('Bodø', 'NL'),
('Brønnøy', 'NL'),
('Rana', 'NL'),
-- ('Mosjøen', 'NL'),
('Narvik', 'NL'),
-- ('Svolvær', 'NL'),
('Oslo', 'OS'),
-- ('Egersund', 'RG'),
('Haugesund', 'RG'),
-- ('Kopervik', 'RG'),
('Sandnes', 'RG'),
-- ('Skudeneshavn', 'RG'),
('Stavanger', 'RG'),
('Hammerfest', 'TF'),
('Harstad', 'TF'),
('Tromsø', 'TF'),
('Vadsø', 'TF'),
('Vardø', 'TF'),
('Levanger', 'TR'),
('Namsos', 'TR'),
('Røros', 'TR'),
('Steinkjer', 'TR'),
('Trondheim', 'TR'),
-- ('Brevik', 'VT'),
('Holmestrand', 'VT'),
('Horten', 'VT'),
('Kragerø', 'VT'),
-- ('Langesund', 'VT'),
('Larvik', 'VT'),
('Notodden', 'VT'),
('Porsgrunn', 'VT'),
('Sandefjord', 'VT'),
('Skien', 'VT'),
-- ('Stathelle', 'VT'),
-- ('Stavern', 'VT'),
('Tønsberg', 'VT'),
-- ('Åsgårdstrand', 'VT'),
('Bergen', 'VE'),
-- ('Florø', 'VE'),
('Drammen', 'VI'),
-- ('Drøbak', 'VI'),
('Fredrikstad', 'VI'),
('Halden', 'VI'),
-- ('Hønefoss', 'VI'),
('Kongsberg', 'VI'),
('Moss', 'VI'),
('Sarpsborg', 'VI'),
-- ('Svelvik', 'VI')
