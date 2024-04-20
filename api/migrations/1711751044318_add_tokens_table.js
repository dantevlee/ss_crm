exports.up = pgm => {
  pgm.createTable('Reset_Tokens',{
    id: 'id',
    email: { type: 'varchar(255)', notNull: true },
    token: { type: 'text', notNull: true },
    created_at: { type: 'timestamp', default: pgm.func('CURRENT_TIMESTAMP') },
  })
};

exports.down = pgm => {
};
