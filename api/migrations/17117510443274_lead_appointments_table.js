exports.up = pgm => {
  pgm.createTable('Lead_Appointments',{
    id: 'id',
    start_time: { type: 'timestamp' },
    endTime: {type: 'timestamp'},
    appointment_start_date: { type: 'timestamp', notNull: true },
    appointment_end_date: { type: 'timestamp', notNull: true },
    title: {type: 'varchar(250)'},
    notes: { type: 'text' },
    lead_id: {
      type: 'integer',
      references: '"Leads"(id)'
    }
  })
};

exports.down = pgm => {};
