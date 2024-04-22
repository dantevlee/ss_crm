exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE "Users"
    ADD COLUMN "confirmed_user" VARCHAR(1) DEFAULT 'N';
  `);
};

exports.down = pgm => {};
