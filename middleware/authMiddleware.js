const supabase = require('../supabaseClient');

const verifyUser = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  console.log('Incoming token:', token); // ✅ DEBUG LOG

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);
    console.log('Supabase user data:', data); // ✅ DEBUG LOG

    if (error || !data?.user) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    req.user = data.user;
    next();
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(500).json({ message: 'Auth verification failed' });
  }
};

module.exports = { verifyUser };
