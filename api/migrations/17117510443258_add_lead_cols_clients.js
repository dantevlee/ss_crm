exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE "Clients"
    ADD COLUMN "phone_number" VARCHAR(36),
    ADD COLUMN "last_contacted_at" DATE,
    ADD COLUMN "social_media_source" VARCHAR(255),
    ADD COLUMN "social_media" VARCHAR(255);
  `);
};

exports.down = pgm => {};
