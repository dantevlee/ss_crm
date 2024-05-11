exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE "Clients"
    ADD COLUMN "start_date" DATE,
    ADD COLUMN "end_date" DATE;
  `);
};

exports.down = pgm => {};
