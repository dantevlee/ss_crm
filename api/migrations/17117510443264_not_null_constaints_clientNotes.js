exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE "Client_Notes"
    ALTER COLUMN title SET NOT NULL,
    ALTER COLUMN text SET NOT NULL;
  `);
};
