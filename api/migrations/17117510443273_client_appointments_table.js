exports.up = pgm => {
  pgm.createTable('Client_Appointments',{
    id: 'id',
    start_time: { type: 'timestamp' },
    endTime: {type: 'timestamp'},
    appointment_date: { type: 'timestamp', notNull: true },
    notes: { type: 'text' },
    client_id: {
      type: 'integer',
      references: '"Clients"(id)'
    }
  })
};

exports.down = pgm => {};
