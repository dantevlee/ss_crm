exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE "Files"
    ADD COLUMN "user_id" INT REFERENCES "Users"("id")
    ; 
  `);
};

exports.down = pgm => {};
