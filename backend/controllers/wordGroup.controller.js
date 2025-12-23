import WordGroup from '../models/wordGroup.model.js';

export const getAllGroups = async (req, res) => {
  try {
    const groups = await WordGroup.find();
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addGroup = async (req, res) => {
  try {
    const group = new WordGroup(req.body);
    await group.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const addGroups = async (req, res) => {
  try {
    const groups = await WordGroup.insertMany(req.body);
    res.status(201).json(groups);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateGroup = async (req, res) => {
  try {
    const group = await WordGroup.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'WordGroup not found' });
    }

    WordGroup.updateOne({ _id: req.params.id }, req.body).then(() => {
      res.status(200).json();
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }

    const result = await WordGroup.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Word group not found" });
    }

    res.status(200).json({
      message: "Word group deleted",
      id: result._id
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

