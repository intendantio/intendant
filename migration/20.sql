CREATE TABLE test_migration(id INTEGER PRIMARY KEY);
UPDATE metadata SET value=20 WHERE reference="version";