import mongoose from 'mongoose';

const WordSchema = new mongoose.Schema({
  word: { type: String, required: true },
  translation: { type: String, required: true },
  groupIds: [{ type: String, required: true }]
});

export default mongoose.model('Word', WordSchema);
