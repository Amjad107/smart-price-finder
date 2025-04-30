const { supabase } = require('../supabaseClient');

exports.searchByText = async (req, res) => {
  console.log('DEBUG - req.user:', req.user); // Debug log

  // ✅ Prevent crash if user is not authenticated
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Unauthorized: user info missing' });
  }

  const userId = req.user.id;
  const { searchTerm, city } = req.body;

  try {
    // Step 1: Find product by name
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('*')
      .ilike('name', `%${searchTerm}%`)
      .single();

    if (productError || !productData) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Step 2: Get tariff based on origin and category
    const { data: tariffData } = await supabase
      .from('tariffs')
      .select('*')
      .eq('country_of_origin', productData.country_of_origin)
      .eq('product_category', productData.category)
      .single();

    const preTariff = tariffData?.tariff_rate_before_april_2025 || 0;
    const postTariff = tariffData?.tariff_rate_after_april_2025 || 0;

    // Step 3: Get market price for user city
    const { data: marketData } = await supabase
      .from('market_prices')
      .select('*')
      .eq('product_id', productData.id)
      .eq('city', city)
      .single();

    if (!marketData) {
      return res.status(404).json({ message: 'Market price for this city not found.' });
    }

    const factoryPrice = productData.factory_price;
    const priceBefore = factoryPrice + (factoryPrice * (preTariff / 100));
    const priceAfter = factoryPrice + (factoryPrice * (postTariff / 100));

    // Step 4: Save search history
    await supabase.from('search_history').insert({
      user_id: userId,
      product_id: productData.id,
      city,
      searched_at: new Date(),
      price_before_tariff: priceBefore,
      price_after_tariff: priceAfter
    });

    // Step 5: Return the full result
    return res.json({
      product: productData,
      tariffs: {
        before_april_2025: preTariff,
        after_april_2025: postTariff
      },
      factory_price: factoryPrice,
      market_price: marketData.price,
      calculated: {
        before_tariff: priceBefore,
        after_tariff: priceAfter
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
