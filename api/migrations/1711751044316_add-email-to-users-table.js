exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE "Users"
    ADD COLUMN email VARCHAR(255) UNIQUE;
  `);
};

exports.down = pgm => {
  pgm.sql(`
    ALTER TABLE "Users"
    DROP COLUMN email;
  `);
};
