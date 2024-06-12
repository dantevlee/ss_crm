exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE "Files"
    DROP CONSTRAINT unique_file_name;
    ; 
  `);
};

exports.down = pgm => {};
