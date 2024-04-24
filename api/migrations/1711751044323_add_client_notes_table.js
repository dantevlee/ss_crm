exports.up = pgm => {
  pgm.createTable('Client_Notes',{
    id: 'id',
    client_id: {
      type: 'integer',
      references: '"Clients"(id)',
      notNull: true
    },
    text: { type: 'varchar(500)', notNull: true },
    created_at: {type: 'timestamp', default: pgm.func('current_timestamp') }
  })
};

exports.down = pgm => {};
