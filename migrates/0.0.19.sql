CREATE TABLE widget(id INTEGER PRIMARY KEY, type TEXT, object TEXT, reference TEXT);
CREATE TABLE widget_argument(id INTEGER PRIMARY KEY,reference TEXT,value TEXT,type TEXT,widget INTEGER);

CREATE TABLE rapport(id INTEGER PRIMARY KEY, chart TEXT, type TEXT, object TEXT, reference TEXT, interval INTEGER);
CREATE TABLE rapport_data(id INTEGER PRIMARY KEY, value TEXT, date TIMESTAMP, rapport INTEGER);
CREATE TABLE rapport_argument(id INTEGER PRIMARY KEY,reference TEXT,value TEXT,type TEXT,rapport INTEGER);