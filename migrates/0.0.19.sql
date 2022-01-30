/* Create new widget model */

CREATE TABLE widget(id INTEGER PRIMARY KEY, type TEXT, object TEXT, reference TEXT);
CREATE TABLE widget_argument(id INTEGER PRIMARY KEY,reference TEXT,value TEXT,type TEXT,widget INTEGER);

CREATE TABLE rapport(id INTEGER PRIMARY KEY, chart TEXT, type TEXT, object TEXT, reference TEXT, interval INTEGER);
CREATE TABLE rapport_data(id INTEGER PRIMARY KEY, value TEXT, date TIMESTAMP, rapport INTEGER);
CREATE TABLE rapport_argument(id INTEGER PRIMARY KEY,reference TEXT,value TEXT,type TEXT,rapport INTEGER);

/* Create new process model */

DROP TABLE process;
DROP TABLE process_action;
DROP TABLE process_input;

CREATE TABLE process(id INTEGER PRIMARY KEY, description_on TEXT, description_off TEXT, mode TEXT, state TEXT, localisation INTEGER);
CREATE TABLE process_action(id INTERGER PRIMARY KEY,process INTEGER, type TEXT, object TEXT, action TEXT, state TEXT);
CREATE TABLE process_input(id INTERGER PRIMARY KEY,process INTEGER, reference TEXT, type TEXT, state TEXT);