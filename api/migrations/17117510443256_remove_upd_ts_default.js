exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE "Client_Notes"
    ALTER COLUMN "updated_at" DROP DEFAULT;
  `);
};

exports.down = pgm => {};
