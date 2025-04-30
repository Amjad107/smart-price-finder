const supabase = require('../supabaseClient'); // ✅ Make sure this path is correct

// GET: Fetch user search history
exports.getSearchHistory = async (req, res) => {
  console.log('User object:', req.user);

  const userId = req.user.id;

  try {
    const { data, error } = await supabase
      .from('search_history')
      .select('*')
      .eq('user_id', userId)
      .order('searched_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching user history:', error);
    return res.status(500).json({ message: 'Failed to fetch user history' });
  }
};

// POST: Save a new search record
exports.saveSearchHistory = async (req, res) => {
  const {
    search_term,
    city,
    factory_price,
    city_market_price,
    pre_tariff_price,
    post_tariff_price,
    price_change_percent,
    user_id,         // optional override
    device_id        // optional
  } = req.body;

  const ip_address = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  try {
    const { data, error } = await supabase
      .from('search_history')
      .insert([
        {
          search_term,
          city,
          factory_price,
          city_market_price,
          pre_tariff_price,
          post_tariff_price,
          price_change_percent,
          user_id: user_id || req.user?.id,
          device_id,
          ip_address,
        },
      ]);

    if (error) throw error;

    return res.status(201).json({ message: 'Search saved', data });
  } catch (error) {
    console.error('Error saving search history:', error);
    return res.status(500).json({ message: 'Failed to save search' });
  }
};
