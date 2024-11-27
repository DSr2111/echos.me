// server/routes/authRoutes.js

const express = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const supabase = require('../services/supabaseClient');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Check username availability
router.get('/check-username/:username', async (req, res) => {
  const { username } = req.params;

  try {
    // Check if username exists in the `Users` table
    const { data: existingUser, error } = await supabase
      .from('Users')
      .select('username')
      .eq('username', username)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116: No rows found error (acceptable case)
      throw error;
    }

    // If `existingUser` is found, username is taken
    res.status(200).json({ available: !existingUser });
  } catch (err) {
    console.error('Error checking username availability:', err);
    res.status(500).json({ error: 'Failed to check username availability.' });
  }
});

// User signup route
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if username already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('Users')
      .select('username')
      .eq('username', username)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'Username is already taken.' });
    }

    if (checkError && checkError.code !== 'PGRST116') {
      // Only throw error if it's not "no rows found"
      throw checkError;
    }

    // Sign up user with Supabase auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return res
        .status(400)
        .json({ error: 'Failed to sign up user in Supabase.' });
    }

    // Insert user into the `Users` table
    const userUuid = uuidv4();
    const { error: dbError } = await supabase.from('Users').insert([
      {
        username,
        email,
        user_uuid: userUuid,
      },
    ]);

    if (dbError) {
      throw dbError;
    }

    res.status(201).json({
      message: 'Signup successful! Please check your email for verification.',
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Error registering user.' });
  }
});

module.exports = router;
