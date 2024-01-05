SELECT * FROM [dbo].[TeslaCars]

DELETE FROM [dbo].[TeslaCars]

DBCC CHECKIDENT ('TeslaCars', RESEED, 0);

INSERT INTO [dbo].[TeslaCars] (TeslaCarGuid, Model, SerialNumber, Location)
VALUES
(newid(), 'S', 'TS-00001-RG', 'Stavanger'),
(newid(), 'S', 'TS-00002-RG', 'Stavanger'),
(newid(), 'X', 'TX-00003-VL', 'Bergen'),
(newid(), '3', 'TX-00004-VL', 'Bergen'),
(newid(), 'X', 'TX-00005-VL', 'Bergen'),
(newid(), '3', 'T3-00006-OS', 'Oslo'),
(newid(), '3', 'T3-00007-OS', 'Oslo'),
(newid(), 'C', 'T3-00008-OS', 'Oslo'),
(newid(), 'Y', 'TY-00009-AG', 'Kristiansand'),
(newid(), 'Y', 'TY-00010-AG', 'Kristiansand'),
(newid(), 'Y', 'TY-00011-AG', 'Kristiansand'),
(newid(), 'C', 'TY-00012-AG', 'Flekkefjord'),
(newid(), 'X', 'TY-00013-RG', 'Haugesund'),
(newid(), 'C', 'TY-00014-RG', 'Haugesund'),
(newid(), 'C', 'TY-00015-RG', 'Haugesund'),
(newid(), '3', 'TY-00016-RG', 'Haugesund'),
(newid(), 'Y', 'TY-00017-RG', 'Haugesund'),
(newid(), 'X', 'TY-00018-RG', 'Haugesund'),
(newid(), 'X', 'TY-00019-RG', 'Haugesund'),
(newid(), 'Y', 'TY-00020-AG', 'Grimstad'),
(newid(), '3', 'TY-00021-AG', 'Porsgrunn'),
(newid(), 'C', 'TY-00022-OS', 'Oslo'),
(newid(), 'Y', 'TY-00023-RG', 'Stavanger')
