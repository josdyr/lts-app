SELECT * FROM [dbo].[TeslaCars]

DELETE FROM [dbo].[TeslaCars]

DBCC CHECKIDENT ('TeslaCars', RESEED, 0);

INSERT INTO [dbo].[TeslaCars] (TeslaCarGuid, Model, SerialNumber, Location)
VALUES
(newid(), 'S', 'TS-00018-RG', 'Stavanger'),
(newid(), 'X', 'TX-00019-VL', 'Bergen'),
(newid(), '3', 'T3-00020-OS', 'Oslo'),
(newid(), 'Y', 'TY-00021-AG', 'Kristiansand'),
(newid(), 'C', 'TY-00021-AG', 'Flekkefjord'),
(newid(), 'X', 'TY-00021-RG', 'Haugesund'),
(newid(), 'Y', 'TY-00021-AG', 'Grimstad'),
(newid(), 'C', 'TY-00021-AG', 'Porsgrunn'),
(newid(), '3', 'TY-00021-OS', 'Oslo'),
(newid(), 'S', 'TY-00021-RG', 'Stavanger')
