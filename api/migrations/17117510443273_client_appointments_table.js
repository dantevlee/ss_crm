exports.up = pgm => {
  pgm.createTable('Client_Appointments',{
    id: 'id',
    start_time: { type: 'timestamp' },
    endTime: {type: 'timestamp'},
    appointment_start_date: { type: 'timestamp', notNull: true },
    appointment_end_date: { type: 'timestamp', notNull: true },
    title: {type: 'varchar(250)'},
    notes: { type: 'text' },
    client_id: {
      type: 'integer',
      references: '"Clients"(id)'
    }
  })
};

exports.down = pgm => {};
