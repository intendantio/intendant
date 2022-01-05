ALTER TABLE 'smartobject' ADD 'localisation' INTEGER DEFAULT 1;

DELETE FROM "localisation";

INSERT INTO "localisation" ("id", "name") VALUES ('1', 'chambre');

CREATE TABLE 'localisation_profile' ( id INTEGER PRIMARY KEY, localisation TEXT, profile INTEGER);

DELETE FROM "authorization";

INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('1', '/configurations/module', 'GET', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('2', '/widgets', 'GET', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('3', '/process', 'GET', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('4', '/routines', 'GET', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('5', '/profiles', 'GET', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('6', '/users', 'GET', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('7', '/configurations/smartobject', 'GET', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('8', '/smartobjects', 'GET', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('9', '/profiles/:idProfile/authorizations', 'GET', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('10', '/profiles/:idProfile/authorizations', 'POST', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('11', '/smartobjects/:idSmartobject', 'GET', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('12', '/modules/:idModule/actions/:idAction', 'POST', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('13', '/configurations/widget', 'GET', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('14', '/widgets/:idWidget', 'GET', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('15', '/smartobjects', 'POST', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('17', '/smartobjects/:idSmartobject/settings/:idSetting', 'DELETE', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('18', '/smartobjects/:idSmartobject/settings', 'POST', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('20', '/smartobjects/:idSmartobject', 'DELETE', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('21', '/widgets', 'POST', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('23', '/widgets/:idWidget', 'PUT', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('27', '/widgets/:idWidget', 'DELETE', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('28', '/users/:idUser', 'PUT', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('30', '/users/:idUser', 'DELETE', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('31', '/users', 'POST', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('33', '/markets/uninstall', 'POST', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('34', '/markets/install', 'POST', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('35', '/routines', 'PUT', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('36', '/routines/:idRoutine/status', 'PUT', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('37', '/routines/:idRoutine/duplicate', 'PUT', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('38', '/routines/:idRoutine', 'DELETE', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('39', '/routines/:idRoutine', 'GET', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('40', '/routines/:idRoutine', 'POST', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('41', '/smartobjects/:id/actions/:idAction', 'POST', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('43', '/espaces', 'GET', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('44', '/process', 'POST', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('45', '/espace/:id/process/:idProcess', 'GET', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('46', '/process/:idprocess/execute', 'POST', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('47', '/process/:idProcess/inputs', 'POST', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('48', '/process/:idProcess/actions', 'POST', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('50', '/process/:idProcess/profiles', 'POST', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('51', '/process/:idProcess/profiles/:idProfile', 'DELETE', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('52', '/process/:idProcess/actions/:idAction', 'DELETE', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('53', '/process/:idProcess/inputs/:idInput', 'DELETE', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('54', '/process/:idProcess', 'DELETE', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('55', '/widgets/:idWidget/content', 'POST', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('56', '/widgets/:idWidget/sources', 'POST', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('57', '/widgets/:idWidget/sources/:idSource', 'DELETE', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('58', '/widgets/:idWidget/content/:idContent', 'DELETE', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('59', '/users/:idUser/password', 'POST', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('60', '/smartobjects/:idSmartobject/profiles/:idProfile', 'DELETE', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('61', '/smartobjects/:idSmartobject/profiles', 'POST', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('62', '/authentification', 'POST', '0');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('63', '/routines', 'POST', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('64', '/client', 'POST', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('65', '/routines/:idRoutine', 'PUT', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('66', '/smartobjects/:idSmartobject/arguments/:idArgument', 'DELETE', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('67', '/smartobjects/:idSmartobject/arguments', 'POST', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('68', '/localisations', 'GET', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('69', '/localisations', 'POST', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('70', '/localisations/:idLocalisation', 'GET', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('71', '/localisations/:idLocalisation', 'DELETE', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('72', '/smartobjects/:idSmartobject/localisation', 'POST', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('73', '/localisations/:idLocalisation/profiles', 'POST', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('74', '/localisations/:idLocalisation/profiles/:idProfile', 'DELETE', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('75', '/localisations/:idLocalisation/actions/:idAction', 'POST', '1');
INSERT INTO "authorization" ("id", "reference", "method", "secure") VALUES ('76', '/markets/upgrade', 'POST', '1');

DELETE FROM "authorization_profile";
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('1', '5', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('2', '9', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('5', '1', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('6', '2', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('7', '3', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('8', '4', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('9', '6', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('10', '7', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('11', '8', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('12', '10', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('16', '12', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('17', '11', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('18', '13', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('19', '14', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('20', '15', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('22', '17', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('23', '18', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('25', '20', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('26', '21', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('27', '23', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('32', '27', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('33', '28', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('35', '30', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('36', '31', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('38', '33', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('39', '34', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('40', '35', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('41', '36', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('42', '37', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('43', '39', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('44', '38', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('45', '40', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('46', '41', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('48', '43', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('49', '44', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('50', '45', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('51', '46', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('52', '47', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('53', '48', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('54', '50', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('55', '51', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('56', '52', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('57', '53', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('58', '54', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('59', '55', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('60', '56', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('61', '57', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('62', '58', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('63', '59', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('64', '60', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('65', '61', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('66', '62', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('67', '63', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('68', '64', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('69', '64', '3');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('70', '2', '3');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('71', '3', '3');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('72', '4', '3');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('73', '43', '3');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('74', '8', '3');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('75', '11', '3');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('76', '41', '3');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('77', '65', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('78', '36', '3');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('79', '48', '3');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('81', '12', '3');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('82', '46', '3');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('86', '14', '3');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('87', '45', '3');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('88', '67', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('89', '66', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('90', '68', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('91', '69', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('92', '70', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('93', '71', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('94', '72', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('95', '73', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('96', '74', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('97', '75', '1');
INSERT INTO "authorization_profile" ("id", "authorization", "profile") VALUES ('98', '76', '1');