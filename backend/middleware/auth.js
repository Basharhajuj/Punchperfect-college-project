const jwt = require('jsonwebtoken');
const Student = require('../models/student');

module.exports = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    (req, res, next) => {
      const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      jwt.verify(token, 'your-secret-key', async (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await Student.findById(decoded.id);
        if (!user) {
          return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = user;
        if (roles.length && !roles.includes(user.role)) {
          return res.status(403).json({ message: 'Forbidden' });
        }

        next();
      });
    }
  ];
};
