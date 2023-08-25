const express = require('express');
const router = express.Router();
const Property= require('../models/PropertyModel');

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

router.get('/', async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(shuffleArray(properties));
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/', async (req, res) => {
  try {
    const {
      title,
      city,
      street,
      category,
      image,
      bedrooms,
      shared,
      description,
      dailyRate,
    } = req.body;

    const property = new Property({
      title,
      city,
      street,
      category,
      image,
      bedrooms,
      shared,
      description,
      dailyRate,
    });

    await property.save();
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
