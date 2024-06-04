exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE "Client_Notes"
    DROP COLUMN "user_id"
    ; 
  `);
};

exports.down = pgm => {};
