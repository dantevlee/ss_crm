exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE "Client_Notes"
    ALTER COLUMN "client_id" DROP NOT NULL
    ; 
  `);
};

exports.down = pgm => {};