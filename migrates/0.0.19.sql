
/* Create new widget model */

CREATE TABLE widget(id INTEGER PRIMARY KEY, type TEXT, object INTEGER, reference TEXT);
CREATE TABLE widget_argument(id INTEGER PRIMARY KEY,reference TEXT,value TEXT,type TEXT,widget INTEGER);

DROP TABLE IF EXISTS rapport;

CREATE TABLE rapport(id INTEGER PRIMARY KEY, chart TEXT, type TEXT, object INTEGER, reference TEXT, interval INTEGER);
CREATE TABLE rapport_data(id INTEGER PRIMARY KEY, value TEXT, date TIMESTAMP, rapport INTEGER);
CREATE TABLE rapport_argument(id INTEGER PRIMARY KEY,reference TEXT,value TEXT,type TEXT,rapport INTEGER);

/* Create new process model */

DROP TABLE IF EXISTS process;
DROP TABLE IF EXISTS process_action;
DROP TABLE IF EXISTS process_action_argument;
DROP TABLE IF EXISTS process_input_option;
DROP TABLE IF EXISTS process_input;

DROP TABLE IF EXISTS localisation;
DROP TABLE IF EXISTS localisation_profile;

DROP TABLE IF EXISTS espace;

CREATE TABLE process(id INTEGER PRIMARY KEY, description TEXT, description_on TEXT, description_off TEXT, mode TEXT, state TEXT, room INTEGER);
CREATE TABLE process_action(id INTEGER PRIMARY KEY,process INTEGER, type TEXT, object INTEGER, action TEXT, state TEXT);
CREATE TABLE process_action_argument(id INTEGER PRIMARY KEY, reference TEXT, value TEXT, process_action INTEGER, default_value TEXT);
CREATE TABLE process_input(id INTEGER PRIMARY KEY,process INTEGER, reference TEXT, type TEXT, state TEXT);
CREATE TABLE process_input_option(id INTEGER PRIMARY KEY, reference TEXT, value TEXT, process_input INTEGER);

/* Create room */

DROP TABLE IF EXISTS room;
DROP TABLE IF EXISTS room_profile;

CREATE TABLE room(id INTEGER PRIMARY KEY, name TEXT, description TEXT, icon TEXT);
CREATE TABLE room_profile(id INTEGER PRIMARY KEY, room INTEGER, profile INTEGER);

/* Create user */

DROP TABLE IF EXISTS client;

DROP TABLE IF EXISTS user;
CREATE TABLE user(id INTEGER PRIMARY KEY, login TEXT, imei TEXT, password TEXT, salt TEXT, profile INTEGER);

DROP TABLE IF EXISTS user_history;
CREATE TABLE user_history(id INTEGER PRIMARY KEY, type TEXT, action TEXT, user INTEGER, date TIMESTAMP);

DROP TABLE IF EXISTS version;
DROP TABLE IF EXISTS metadata;


DROP TABLE IF EXISTS configuration;
DROP TABLE IF EXISTS metadata;
/*
INSERT INTO metadata(reference,value) VALUES ("database",19)
*/
CREATE TABLE metadata(id INTEGER PRIMARY KEY, reference TEXT, value TEXT);


DROP TABLE IF EXISTS single_code;
CREATE TABLE single_code(id INTEGER PRIMARY KEY, code TEXT, smartobject INTEGER);



DROP TABLE IF EXISTS routine;
DROP TABLE IF EXISTS routine_effect;
DROP TABLE IF EXISTS routine_effect_argument;
DROP TABLE IF EXISTS routine_trigger;
DROP TABLE IF EXISTS routine_trigger_argument;

/*
    Type automation
    
    - Récurrent (execute each time)
    - Date  (execute in date)
    - Event (execute when click on button)


*/

DROP TABLE IF EXISTS automation;
DROP TABLE IF EXISTS automation_trigger;
DROP TABLE IF EXISTS automation_action;
DROP TABLE IF EXISTS automation_action_argument;


CREATE TABLE automation(id INTEGER PRIMARY KEY, reference TEXT);
CREATE TABLE automation_trigger(id INTEGER PRIMARY KEY, automation INTEGER, type TEXT, object INTEGER, trigger TEXT );
CREATE TABLE automation_action(id INTEGER PRIMARY KEY, automation INTEGER, type TEXT, object INTEGER, action TEXT );
CREATE TABLE automation_action_argument(id INTEGER PRIMARY KEY, reference TEXT, value TEXT, automation_action INTEGER);


/*
DROP TABLE IF EXISTS configuration;
CREATE TABLE configuration(id INTEGER PRIMARY KEY, reference TEXT, value TEXT);
INSERT INTO configuration (reference,value) VALUES ("database",19)
INSERT INTO version (model) VALUES(19);
*/

/* 
    
    DROP TABLE IF EXISTS smartobject;
    DELETE TABLE smartobject_routine;
    DELETE TABLE smartobject_profile;
    DELETE TABLE smartobject_status;

    CREATE TABLE "smartobject" (
        "id"	INTEGER,
        "module"	varchar(255) NOT NULL,
        "reference"	varchar(64) NOT NULL,
        "status"	INTEGER NOT NULL,
        "last_use"	datetime NOT NULL,
        "room"	INTEGER,
        PRIMARY KEY("id" AUTOINCREMENT)
    );
*/
