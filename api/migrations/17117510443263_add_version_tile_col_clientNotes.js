exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE "Client_Notes"
    ADD COLUMN "version" VARCHAR(100) SET NOT NULL,
    ADD COLUMN "title" VARCHAR(250)
    ; 
  `);
};

exports.down = pgm => {};
