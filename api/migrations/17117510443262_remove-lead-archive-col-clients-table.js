exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE "Clients"
    DROP COLUMN "is_lead",
    DROP COLUMN "is_archived",
    DROP COLUMN "last_contacted_at"
    ; 
  `);
};

exports.down = pgm => {};
