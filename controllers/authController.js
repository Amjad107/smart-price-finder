const supabase = require('../supabaseClient');

// Signup
exports.signup = async (req, res) => {
  const { email, password } = req.body;

    try {
        const { data, error } = await supabase.auth.signUp({
              email,
                    password,
                        });

                            if (error) throw error;

                                return res.status(201).json({ message: 'User signed up successfully.', user: data.user });
                                  } catch (error) {
                                      console.error('Error signing up:', error);
                                          res.status(500).json({ message: 'Signup error.', error: error.message });
                                            }
                                            };

                                            // Login
                                            exports.login = async (req, res) => {
                                              const { email, password } = req.body;

                                                try {
                                                    const { data, error } = await supabase.auth.signInWithPassword({
                                                          email,
                                                                password,
                                                                    });

                                                                        if (error) throw error;

                                                                            return res.status(200).json({ message: 'User logged in successfully.', session: data.session });
                                                                              } catch (error) {
                                                                                  console.error('Error logging in:', error);
                                                                                      res.status(500).json({ message: 'Login error.', error: error.message });
                                                                                        }
                                                                                        };