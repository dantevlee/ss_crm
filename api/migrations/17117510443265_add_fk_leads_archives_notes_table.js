exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE "Client_Notes"
    ADD COLUMN "lead_id" INT REFERENCES "Leads"("id"),
    ADD COLUMN "archive_id" INT REFERENCES "Archives"("id")
    ; 
  `);
};

exports.down = pgm => {};