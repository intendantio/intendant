CREATE TABLE test_migration(id INTEGER PRIMARY KEY);
UPDATE configuration SET value=20 WHERE reference="database";