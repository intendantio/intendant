
/* Create new widget model */

CREATE TABLE widget(id INTEGER PRIMARY KEY, type TEXT, object TEXT, reference TEXT);
CREATE TABLE widget_argument(id INTEGER PRIMARY KEY,reference TEXT,value TEXT,type TEXT,widget INTEGER);

CREATE TABLE rapport(id INTEGER PRIMARY KEY, chart TEXT, type TEXT, object TEXT, reference TEXT, interval INTEGER);
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
CREATE TABLE process_action(id INTEGER PRIMARY KEY,process INTEGER, type TEXT, object TEXT, action TEXT, state TEXT);
CREATE TABLE process_action_argument(id INTEGER PRIMARY KEY, reference TEXT, value TEXT, process_action INTEGER, default_value TEXT);
CREATE TABLE process_input(id INTEGER PRIMARY KEY,process INTEGER, reference TEXT, type TEXT, state TEXT);
CREATE TABLE process_input_option(id INTEGER PRIMARY KEY, reference TEXT, value TEXT, process_input INTEGER);

/* Create room */

DROP TABLE IF EXISTS room;
DROP TABLE IF EXISTS room_profile;

CREATE TABLE room(id INTEGER PRIMARY KEY, name TEXT, description TEXT, icon TEXT);
CREATE TABLE room_profile(id INTEGER PRIMARY KEY, room INTEGER, profile INTEGER);






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
