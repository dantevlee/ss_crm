exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE "Users"
    ADD COLUMN "confirmation_token" TEXT;
  `);
};

exports.down = pgm => {};
