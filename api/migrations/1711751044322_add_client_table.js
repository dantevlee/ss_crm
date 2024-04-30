exports.up = pgm => {
  pgm.createTable('Clients',{
    id: 'id',
    user_id: {
      type: 'integer',
      references: '"Users"(id)',
      notNull: true
    },
    firstName: { type: 'varchar(225)', notNull: true },
    lastName: { type: 'varchar(225)', notNull: true },
    client_email: {type: 'varchar(500)'},
    is_lead: {type: 'varchar(1)'},
    is_archived: {type: 'varchar(1)'}
  })
};

exports.down = pgm => {};
