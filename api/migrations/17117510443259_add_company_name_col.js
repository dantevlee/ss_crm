exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE "Users"
    ADD COLUMN "company_name" VARCHAR(255)
  `);
};

exports.down = pgm => {};