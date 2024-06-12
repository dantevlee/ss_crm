exports.up = pgm => {
  pgm.createTable('Files',{
    id: 'id',
    file_name: { type: 'text', notNull: true },
    file_type: { type: 'text', notNull: true, check: "file_type IN ('pdf', 'excel', 'docx')" },
    file_data: { type: 'bytea', notNull: true },
    upload_date: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_timestamp: { type: 'timestamp', default: pgm.func('current_timestamp') },
    client_id: {
      type: 'integer',
      references: '"Clients"(id)',
    },
    lead_id: {
      type: 'integer',
      references: '"Leads"(id)',
    },
    archive_id: {
      type: 'integer',
      references: '"Archives"(id)',
    },
  })
};

exports.down = pgm => {};
