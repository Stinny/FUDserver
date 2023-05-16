const mongoose = require('mongoose');

const fileShcema = new mongoose.Schema(
  {
    userId: { type: String },
    url: { type: String },
    key: { type: String },
    name: { type: String },
  },
  { timestamps: true }
);

const File = mongoose.model('File', fileShcema);

module.exports = File;
