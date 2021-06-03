CREATE TABLE IF NOT EXISTS urls (
  id BIGSERIAL,
  url TEXT NOT NULL,
  alias TEXT UNIQUE NOT NULL,
  private BOOL DEFAULT FALSE,
  count BIGINT DEFAULT 0,
  created_at TIMESTAMP without time zone DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ( id )
);

CREATE INDEX urls_alias_idx ON urls(alias);
