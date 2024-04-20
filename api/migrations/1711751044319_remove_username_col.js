exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE "Users"
    DROP COLUMN "userName";
  `);
};

exports.down = pgm => {};
