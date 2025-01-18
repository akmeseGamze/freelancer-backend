const jwt = require('jsonwebtoken');
const Freelancer = require('../../models/Freelancer');

function isEmail(email) {
  var emailFormat = /^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (email !== '' && email.match(emailFormat)) { return true; }
  
  return false;
}

const autoLogin = async (req, res, next) => {
  const freelancer = await req.freelancer;

  const token = jwt.sign({ freelancerId: freelancer._id }, process.env.SECRET_KEY, {
    expiresIn: '1 hour'
  });

  return res.json({ freelancer: freelancer, token: token });
};

// Register a new freelancer
const register = async (req, res, next) => {

  const { first_name, last_name, email, password, phone_number, about, role } = req.body;

  if (!password || password.length < 8) {
    res.json({ message: 'password_error' });
    return;
  }

  if (!email) {
    res.json({ message: 'email_error' });
    return;
  }

  if (! isEmail(email)) {
    res.json({ message: 'email_error' });
    return;
  }

  if (!role) {
    res.json({ message: 'role_error' });
    return;
  }

  if (!phone_number) {
    res.json({ message: 'phone_number_error' });
    return;
  }

  if (about && about.length > 3072) {
    res.json({ error: 'about_error' });
    return;
  }

  if (!first_name) {
    res.json({ error: 'first_name_error' });
    return;
  }

  if (!last_name) {
    res.json({ error: 'last_name_error' });
    return;
  }

  try {
    const freelancer = new Freelancer({ role, first_name, last_name, email, password: password, phone_number, about });
    await freelancer.save();
    const token = jwt.sign({ freelancerId: freelancer._id }, process.env.SECRET_KEY, {
      expiresIn: '1 hour'
    });
    res.json({freelancer: freelancer, token:token });
  } catch (error) {
    next(error);
  }
};

// Login with an existing freelancer
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const freelancer = await Freelancer.findOne({ email });
    if (!freelancer) {
      return res.status(404).json({ message: 'freelancer_credentials_incorrect' });
    }

    const passwordMatch = await freelancer.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'freelancer_credentials_incorrect' });
    }

    const token = jwt.sign({ freelancerId: freelancer._id }, process.env.SECRET_KEY, {
      expiresIn: '1 hour'
    });
    res.json({ token:token, freelancer:freelancer });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, autoLogin };