exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE "Users"
    ALTER COLUMN email SET NOT NULL;
  `);
};
