exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE "Files"
    ADD CONSTRAINT unique_file_name UNIQUE ("file_name");
    ; 
  `);
};

exports.down = pgm => {};
