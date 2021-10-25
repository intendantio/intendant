BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "authorization" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT,
	"reference" varchar(255) NOT NULL,
	"method" varchar(255) NOT NULL,
	"secure" tinyint(4) NOT NULL
);
CREATE TABLE IF NOT EXISTS "authorization_profile" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT,
	"authorization" INTEGER NOT NULL,
	"profile" INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS "cache" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT,
	"reference" varchar(255) NOT NULL,
	"value" longtext NOT NULL,
	"expiry" datetime NOT NULL
);
CREATE TABLE IF NOT EXISTS "client" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT,
	"imei" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"token" varchar(1024) NOT NULL,
	"user" INTEGER DEFAULT NULL,
	"lastupdate" datetime NOT NULL
);
CREATE TABLE IF NOT EXISTS "espace" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT,
	"reference" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	"icon" varchar(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS "localisation" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT,
	"name" varchar(64) NOT NULL,
	"icon" varchar(64) NOT NULL
);
CREATE TABLE IF NOT EXISTS "process" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT,
	"reference" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"name_enable" varchar(255) NOT NULL,
	"name_disable" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	"espace" INTEGER NOT NULL,
	"icon" varchar(255) NOT NULL,
	"enable" tinyint(4) NOT NULL,
	"mode" varchar(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS "process_action" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT,
	"process" INTEGER NOT NULL,
	"object" varchar(255) NOT NULL,
	"action" varchar(255) NOT NULL,
	"enable" INTEGER NOT NULL,
	"type" varchar(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS "process_action_argument" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT,
	"reference" varchar(255) NOT NULL,
	"value" varchar(255) NOT NULL,
	"process_action" INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS "process_input" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT,
	"reference" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"enable" INTEGER NOT NULL,
	"process" INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS "process_profile" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT,
	"process" INTEGER NOT NULL,
	"profile" INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS "profile" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT,
	"name" varchar(20) NOT NULL
);
CREATE TABLE IF NOT EXISTS "routine" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT,
	"name" varchar(255) NOT NULL,
	"watch" varchar(255) NULL,
	"icon" varchar(255) NOT NULL,
	"status" INTEGER NOT NULL,
	"mode" varchar(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS "routine_effect" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT,
	"routine" INTEGER NOT NULL,
	"source" varchar(255) NOT NULL,
	"action" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS "routine_effect_argument" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT,
	"reference" varchar(255) NOT NULL,
	"value" varchar(255) NOT NULL,
	"routine_effect" INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS "routine_trigger" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT,
	"routine" INTEGER NOT NULL,
	"source" varchar(255) NOT NULL,
	"action" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"result" varchar(255) DEFAULT NULL,
	"statement" varchar(255) DEFAULT NULL,
	"expected" varchar(255) DEFAULT NULL
);
CREATE TABLE IF NOT EXISTS "routine_trigger_argument" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT,
	"reference" varchar(255) NOT NULL,
	"value" varchar(255) NOT NULL,
	"routine_trigger" INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS "smartobject" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT,
	"module" varchar(255) NOT NULL,
	"reference" varchar(64) NOT NULL,
	"status" INTEGER NOT NULL,
	"last_use" datetime NOT NULL
);
CREATE TABLE IF NOT EXISTS "smartobject_argument" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT,
	"smartobject" INTEGER NOT NULL,
	"reference" varchar(255) NOT NULL,
	"value" varchar(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS "smartobject_profile" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT,
	"smartobject" INTEGER NOT NULL,
	"profile" INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS "smartobject_status" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT,
	"name" varchar(255) NOT NULL,
	"icon" varchar(64) NOT NULL
);
CREATE TABLE IF NOT EXISTS "storage" (
	"id" varchar(255) NOT NULL,
	"value" longtext
);
CREATE TABLE IF NOT EXISTS "user" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT,
	"login" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"salt" varchar(255) NOT NULL,
	"profile" INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS "widget" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT,
	"reference" varchar(2048) NOT NULL,
	"icon" varchar(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS "widget_content" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT,
	"type" INTEGER NOT NULL,
	"content" varchar(2048) NOT NULL,
	"widget" INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS "widget_content_type" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT,
	"reference" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"rank" INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS "widget_source" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT,
	"reference" varchar(255) NOT NULL,
	"widget" INTEGER NOT NULL,
	"object" varchar(255) NOT NULL,
	"action" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS "widget_source_argument" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT,
	"reference" varchar(255) NOT NULL,
	"value" varchar(255) NOT NULL,
	"widget_source" INTEGER NOT NULL
);
INSERT INTO "authorization" ("id", "reference", "method", "secure")
VALUES (1, '/configurations/module', 'GET', 1),
	(2, '/widgets', 'GET', 1),
	(3, '/process', 'GET', 1),
	(4, '/routines', 'GET', 1),
	(5, '/profiles', 'GET', 1),
	(6, '/users', 'GET', 1),
	(7, '/configurations/smartobject', 'GET', 1),
	(8, '/smartobjects', 'GET', 1),
	(9, '/profiles/:idProfile/authorizations', 'GET', 1),
	(
		10,
		'/profiles/:idProfile/authorizations',
		'POST',
		1
	),
	(11, '/smartobjects/:idSmartobject', 'GET', 1),
	(
		12,
		'/modules/:idModule/actions/:idAction',
		'POST',
		1
	),
	(13, '/configurations/widget', 'GET', 1),
	(14, '/widgets/:idWidget', 'GET', 1),
	(15, '/smartobjects', 'POST', 1),
	(
		17,
		'/smartobjects/:idSmartobject/settings/:idSetting',
		'DELETE',
		1
	),
	(
		18,
		'/smartobjects/:idSmartobject/settings',
		'POST',
		1
	),
	(20, '/smartobjects/:idSmartobject', 'DELETE', 1),
	(21, '/widgets', 'POST', 1),
	(23, '/widgets/:idWidget', 'PUT', 1),
	(27, '/widgets/:idWidget', 'DELETE', 1),
	(28, '/users/:idUser', 'PUT', 1),
	(30, '/users/:idUser', 'DELETE', 1),
	(31, '/users', 'POST', 1),
	(33, '/markets/uninstall', 'POST', 1),
	(34, '/markets/install', 'POST', 1),
	(35, '/routines', 'PUT', 1),
	(36, '/routines/:idRoutine/status', 'PUT', 1),
	(37, '/routines/:idRoutine/duplicate', 'PUT', 1),
	(38, '/routines/:idRoutine', 'DELETE', 1),
	(39, '/routines/:idRoutine', 'GET', 1),
	(40, '/routines/:idRoutine', 'POST', 1),
	(
		41,
		'/smartobjects/:id/actions/:idAction',
		'POST',
		1
	),
	(43, '/espaces', 'GET', 1),
	(44, '/process', 'POST', 1),
	(45, '/espace/:id/process/:idProcess', 'GET', 1),
	(46, '/process/:idprocess/execute', 'POST', 1),
	(47, '/process/:idProcess/inputs', 'POST', 1),
	(48, '/process/:idProcess/actions', 'POST', 1),
	(50, '/process/:idProcess/profiles', 'POST', 1),
	(
		51,
		'/process/:idProcess/profiles/:idProfile',
		'DELETE',
		1
	),
	(
		52,
		'/process/:idProcess/actions/:idAction',
		'DELETE',
		1
	),
	(
		53,
		'/process/:idProcess/inputs/:idInput',
		'DELETE',
		1
	),
	(54, '/process/:idProcess', 'DELETE', 1),
	(55, '/widgets/:idWidget/content', 'POST', 1),
	(56, '/widgets/:idWidget/sources', 'POST', 1),
	(
		57,
		'/widgets/:idWidget/sources/:idSource',
		'DELETE',
		1
	),
	(
		58,
		'/widgets/:idWidget/content/:idContent',
		'DELETE',
		1
	),
	(59, '/users/:idUser/password', 'POST', 1),
	(
		60,
		'/smartobjects/:idSmartobject/profiles/:idProfile',
		'DELETE',
		1
	),
	(
		61,
		'/smartobjects/:idSmartobject/profiles',
		'POST',
		1
	),
	(62, '/authentification', 'POST', 0),
	(63, '/ping', 'GET', 0),
	(
		64,
		'/routines',
		'POST',
		1
	),(
		65,
		'/routines/:idRoutine',
		'PUT',
		1
	);
INSERT INTO "authorization_profile" ("id", "authorization", "profile")
VALUES (5, 1, 1),
	(6, 2, 1),
	(7, 3, 1),
	(8, 4, 1),
	(1, 5, 1),
	(9, 6, 1),
	(10, 7, 1),
	(11, 8, 1),
	(2, 9, 1),
	(12, 10, 1),
	(17, 11, 1),
	(16, 12, 1),
	(18, 13, 1),
	(19, 14, 1),
	(20, 15, 1),
	(22, 17, 1),
	(23, 18, 1),
	(25, 20, 1),
	(26, 21, 1),
	(27, 23, 1),
	(32, 27, 1),
	(33, 28, 1),
	(35, 30, 1),
	(36, 31, 1),
	(38, 33, 1),
	(39, 34, 1),
	(40, 35, 1),
	(41, 36, 1),
	(42, 37, 1),
	(44, 38, 1),
	(43, 39, 1),
	(45, 40, 1),
	(46, 41, 1),
	(48, 43, 1),
	(49, 44, 1),
	(50, 45, 1),
	(51, 46, 1),
	(52, 47, 1),
	(53, 48, 1),
	(54, 50, 1),
	(55, 51, 1),
	(56, 52, 1),
	(57, 53, 1),
	(58, 54, 1),
	(59, 55, 1),
	(60, 56, 1),
	(61, 57, 1),
	(62, 58, 1),
	(63, 59, 1),
	(64, 60, 1),
	(65, 61, 1),
	(66, 64, 1),
	(67, 65, 1);
INSERT INTO "espace" ("id", "reference", "name", "description", "icon")
VALUES (
		1,
		'Light',
		'Éclairage',
		'Modifier les lumières dune pièce',
		'bulb-outline'
	),
	(
		2,
		'Weather',
		'Météo',
		'Récupérer les informations intérieur et extérieur ',
		'umbrella-outline'
	),
	(
		3,
		'Security',
		'Sécurité',
		'Activer la sécurité dune application',
		'shield-outline'
	),
	(
		4,
		'Environment',
		'Environnement',
		'Gestion de lenvironnement',
		'droplet-outline'
	),
	(
		5,
		'Cooking',
		'Cuisine',
		'Gestion de la cuisine',
		'book-outline'
	);
INSERT INTO "localisation" ("id", "name", "icon")
VALUES (1, 'chambre', 'Home'),
	(2, 'salon', 'Home'),
	(3, 'cuisine', 'Home'),
	(4, 'bureau', 'Home');
INSERT INTO "profile" ("id", "name")
VALUES (1, 'admin'),
	(2, 'guest'),
	(3, 'occupant');
INSERT INTO "smartobject_status" ("id", "name", "icon")
VALUES (1, 'En ligne', 'flash'),
	(2, 'Hors ligne', 'flash-off'),
	(3, 'Smartobject inconnu', 'alert-triangle');
INSERT INTO "widget_content_type" ("id", "reference", "name", "rank")
VALUES (1, 'title', 'Title', 1),
	(2, 'content', 'Content', 2),
	(3, 'list', 'List', 3);
COMMIT;