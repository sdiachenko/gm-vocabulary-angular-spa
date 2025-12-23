import Word from '../models/word.model.js';

export const getAllWords = async (req, res) => {
  try {
    const words = await Word.find();
    res.json(words);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addWord = async (req, res) => {
  try {
    const word = new Word(req.body);
    await word.save();
    res.status(201).json(word);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateWord = async (req, res) => {
  try {
    const word = await Word.findById(req.params.id);

    if (!word) {
      return res.status(404).json({ message: 'Word not found' });
    }

    Word.updateOne({ _id: req.params.id }, req.body).then(() => {
      res.status(200).json();
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteWords = async (req, res) => {
  try {
    const ids = req.body.ids;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "ids must be a non-empty array" });
    }

    const result = await Word.deleteMany({
      _id: { $in: ids }
    });

    return res.status(200).json({
      message: "Words deleted",
      deletedCount: result.deletedCount
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};
