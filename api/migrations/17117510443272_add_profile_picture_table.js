exports.up = pgm => {
  pgm.createTable('Profile_Pictures', {
      id: 'id',
      user_id: { type: 'int', notNull: true, references: '"Users"', onDelete: 'cascade' },
      file_data: { type: 'bytea', notNull: true },
      file_name: { type: 'varchar(255)', notNull: true },
      file_type: { type: 'varchar(50)', notNull: true },
      file_size: { type: 'bigint', notNull: true },
      uploaded_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });

  pgm.addConstraint('Profile_Pictures', 'fk_Profile_Pictures_user_id', {
      foreignKeys: {
          columns: 'user_id',
          references: '"Users"(id)',
          onDelete: 'CASCADE'
      }
  });
  pgm.addConstraint('Profile_Pictures', 'chk_Profile_Pictures_file_type', {
    check: "file_type IN ('image/jpeg', 'image/png', 'image/gif')"
  });
};



exports.down = pgm => {

};