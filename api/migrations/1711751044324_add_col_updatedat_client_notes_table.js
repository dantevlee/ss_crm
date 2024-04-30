exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE "Client_Notes"
    ADD COLUMN "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
  `);
};

exports.down = pgm => {};
