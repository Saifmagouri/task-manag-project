-- Executed on first container startup only (empty volume).
-- Spring JPA ddl-auto handles schema creation.
GRANT ALL PRIVILEGES ON stage.* TO 'stageapp'@'%';
FLUSH PRIVILEGES;
