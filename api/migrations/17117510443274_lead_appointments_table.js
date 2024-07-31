exports.up = pgm => {
  pgm.createTable('Lead_Appointments',{
    id: 'id',
    start_time: { type: 'timestamp' },
    endTime: {type: 'timestamp'},
    appointment_date: { type: 'timestamp', notNull: true },
    notes: { type: 'text' },
    lead_id: {
      type: 'integer',
      references: '"Leads"(id)'
    }
  })
};

exports.down = pgm => {};
