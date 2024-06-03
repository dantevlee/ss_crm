exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE "Client_Notes"
    ADD COLUMN "user_id" INT REFERENCES "Users"("id")
    ; 
  `);
};

exports.down = pgm => {};