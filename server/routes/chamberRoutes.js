const express = require('express');
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs
const supabase = require('../services/supabaseClient');
const router = express.Router();

// Create a new chamber
router.post('/create', async (req, res) => {
  const { user_uuid, name, language, category, keywords } = req.body;

  if (!user_uuid || !name) {
    return res
      .status(400)
      .json({ error: 'User ID and chamber name are required.' });
  }

  try {
    const { error } = await supabase.from('Chambers').insert([
      {
        chamber_id: uuidv4(),
        user_uuid,
        name,
        language,
        category,
        keywords,
      },
    ]);

    if (error) throw error;

    res.status(201).json({ message: 'Chamber created successfully!' });
  } catch (err) {
    console.error('Error creating chamber:', err);
    res.status(500).json({ error: 'Failed to create chamber.' });
  }
});

// Fetch all chambers for a user
router.get('/user/:user_uuid', async (req, res) => {
  const { user_uuid } = req.params;

  try {
    const { data, error } = await supabase
      .from('Chambers')
      .select('*')
      .eq('user_uuid', user_uuid);

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching chambers:', err);
    res.status(500).json({ error: 'Failed to fetch chambers.' });
  }
});

// Fetch details of a specific chamber
router.get('/:chamber_id', async (req, res) => {
  const { chamber_id } = req.params;

  try {
    const { data, error } = await supabase
      .from('Chambers')
      .select('*')
      .eq('chamber_id', chamber_id)
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching chamber details:', err);
    res.status(500).json({ error: 'Failed to fetch chamber details.' });
  }
});

// Delete a chamber
router.delete('/:chamber_id', async (req, res) => {
  const { chamber_id } = req.params;

  try {
    const { error } = await supabase
      .from('Chambers')
      .delete()
      .eq('chamber_id', chamber_id);

    if (error) throw error;

    res.status(200).json({ message: 'Chamber deleted successfully!' });
  } catch (err) {
    console.error('Error deleting chamber:', err);
    res.status(500).json({ error: 'Failed to delete chamber.' });
  }
});

module.exports = router;
