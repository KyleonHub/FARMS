/**
 * Authentication Controller
 */

exports.login = (req, res) => {
  const { email, password } = req.body;
  
  if (
    (email === 'admin@farms.edu' && password === 'admin123') ||
    (email === 'admin1@gmail.com' && password === 'password123')
  ) {
    return res.json({
      success: true,
      user: { email, name: 'System Admin', role: 'Super Admin' },
      token: 'mock-jwt-token-12345'
    });
  }

  if (email === 'faculty@farms.edu' && password === 'faculty123') {
    return res.json({
      success: true,
      user: { email, name: 'Prof. Maria Santos', role: 'Faculty' },
      token: 'mock-jwt-faculty-token'
    });
  }

  if (email === 'student@farms.edu' && password === 'student123') {
    return res.json({
      success: true,
      user: { email, name: 'Student Portal User', role: 'Student' },
      token: 'mock-jwt-student-token'
    });
  }

  return res.status(401).json({ success: false, message: 'Invalid email or password.' });
};
