const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 64,
  },
  message: {
    type: String,
  },
  readFlag: {
    type: Boolean,
    default: false,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Records', RecordSchema);
