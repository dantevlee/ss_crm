exports.up = pgm => {
  pgm.createTable('Archives',{
    id: 'id',
    user_id: {
      type: 'integer',
      references: '"Users"(id)',
      notNull: true
    },
    firstName: { type: 'varchar(225)', notNull: true },
    lastName: { type: 'varchar(225)', notNull: true },
    email: {type: 'varchar(500)'},
    phone_number: {type: 'varchar(36)'},
    social_media_source: {type: 'varchar(255)'},
    soical_media: {type: 'varchar(255)'},
    last_active_date: {type: 'date'}
  })
};

exports.down = pgm => {};