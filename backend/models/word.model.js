import mongoose from 'mongoose';

const WordSchema = new mongoose.Schema({
  word: { type: String, required: true },
  translation: { type: String, required: true },
  collectionId: { type: String },
  collectionName: { type: String }
});

export default mongoose.model('Word', WordSchema);
