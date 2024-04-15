exports.up = pgm => {
  pgm.createTable('Users',{
    id: 'id',
    firstName: { type: 'varchar(225)', notNull: true },
    lastName: { type: 'varchar(225)', notNull: true },
    userName: { type: 'varchar(225)', notNull: true, unique: true },
    password: { type: 'varchar(225)', notNull: true },
  })
};

exports.down = pgm => {};
