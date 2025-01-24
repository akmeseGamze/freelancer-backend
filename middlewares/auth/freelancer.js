const jwt = require('jsonwebtoken');
const Freelancer = require('../../models/Freelancer');

const authenticate = async (req, res, next) => {
  var token = req.headers.authorization?.split(' ')[1];

  if (! token) {
    token = req.body.authentication_token;
  }

  if (!token) {
    return res.json({ message: 'authentication_error' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const freelancer = await Freelancer.findById(decodedToken.freelancerId);
    if (!freelancer) {
      return res.json({ message: 'authentication_error' });
    }

    req.freelancer = freelancer;
    next();
  } catch (error) {
    res.json({ message: 'authentication_error' });
  }
};

module.exports = { authenticate };