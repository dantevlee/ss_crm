exports.up = pgm => {
  pgm.createTable('Leads',{
    id: 'id',
    user_id: {
      type: 'integer',
      references: '"Users"(id)',
      notNull: true
    },
    firstName: { type: 'varchar(225)', notNull: true },
    lastName: { type: 'varchar(225)', notNull: true },
    lead_email: {type: 'varchar(500)'},
    phone_number: {type: 'varchar(36)'},
    social_media_source: {type: 'varchar(255)'},
    soical_media: {type: 'varchar(255)'}, 
    last_contacted_at: {type: 'date'}
  })
};

exports.down = pgm => {};