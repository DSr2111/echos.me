// AuthService.js
import { supabase } from './supabaseClient';

export const signup = async (username, email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    // Insert the user into the custom Users table with username
    const { error: dbError } = await supabase
      .from('Users')
      .insert([{ username, email, user_uuid: data.user.id }]);

    if (dbError) throw dbError;

    return {
      message: 'User registered successfully! Please verify your email.',
    };
  } catch (error) {
    throw { error: error.message || 'Signup failed' };
  }
};

export const login = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Generate and return the token
    const token = data.session?.access_token;

    return { token };
  } catch (error) {
    throw { error: error.message || 'Login failed' };
  }
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error('Failed to log out');
  }
  return { message: 'Logout successful' };
};
