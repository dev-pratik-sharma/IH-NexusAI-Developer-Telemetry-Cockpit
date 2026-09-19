const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Extract token from the Authorization header matrix
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication Denied', message: 'No digital clearance token provided.' });
    }

    // Verify token validity against security signature variable
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'NEXUS_CORE_SECRET_KEY');
    
    // Inject parsed user identity metadata securely into request lanes
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Clearance Conflict', message: 'Cryptographic token verification failed.' });
  }
};

module.exports = auth;
