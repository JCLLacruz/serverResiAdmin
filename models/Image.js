const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;

const ImageSchema = new mongoose.Schema({
    data: Buffer,
    contentType: String,
    user: { type: ObjectId, ref: 'User' }
  });
  
  const Image = mongoose.model('Image', ImageSchema);
  module.exports = Image