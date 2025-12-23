import mongoose from 'mongoose';

const WordGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isShared: { type: Boolean },
  owner: { type: String }
});

export default mongoose.model('WordGroup', WordGroupSchema);
