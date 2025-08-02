const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

// GET Login Page
exports.getLogin = (req, res, next) => {
  console.log(req.url, req.method);
  res.render('auth/login', {
    pageTitle: 'Login',
    isLoggedIn: false,
    errors: [],
    oldInput: { email: '' },
    user: {}
  });
};

// POST Login - Authenticate User
exports.postLogin = async (req, res, next) => {
  console.log(req.body);

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(422).render("auth/login", {
        pageTitle: "Login",
        isLoggedIn: false,
        errors: ["User not found. Please try again."],
        oldInput: { email },
        user: {}
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(422).render("auth/login", {
        pageTitle: "Login",
        isLoggedIn: false,
        errors: ["Invalid password. Please try again."],
        oldInput: { email }
      });
    }

    req.session.isLoggedIn = true;
    req.session.user = user;
    await req.session.save();
    res.redirect("/");

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).render("auth/login", {
      pageTitle: "Login",
      isLoggedIn: false,
      errors: ["Something went wrong. Please try again."],
      oldInput: { email: req.body.email || '' }
    });
  }
};

// POST Logout - Destroy Session
exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    return res.redirect("/");
  });
};

// GET Signup Page
exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    pageTitle: 'Sign Up',
    isLoggedIn: false,
    errors: [],
    oldInput: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      UserType: ''
    }
  });
};

// POST Signup - Register New User
exports.postSignup = [
  // Validation middleware
  check('firstName')
    .trim()
    .isLength({ min: 3 })
    .matches(/^[a-zA-Z]+$/)
    .withMessage('First name must be at least 3 characters long and contain only letters'),

  check('lastName')
    .matches(/^[a-zA-Z]*$/)
    .withMessage('Last name must contain only letters'),

  check('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),

  check('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[@$!%*?&]/)
    .withMessage('Password must contain at least one special character')
    .trim(),

  check('ConfirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

  check('UserType')
    .notEmpty()
    .withMessage('User type is required')
    .isIn(['host', 'guest'])
    .withMessage('Invalid user type'),

  check('terms')
    .notEmpty()
    .withMessage('You must agree to the terms and conditions'),

  // Controller function
  async (req, res, next) => {
    try {
      const { firstName, lastName, email, password, UserType } = req.body;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
          pageTitle: 'Sign Up',
          isLoggedIn: false,
          errors: errors.array().map(err => err.msg),
          oldInput: {
            firstName,
            lastName,
            email,
            password: '', // Don't send password back for security
            UserType
          },
          user: {},
          validationErrors: errors.array()
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        return res.status(422).render('auth/signup', {
          pageTitle: 'Sign Up',
          isLoggedIn: false,
          errors: ['User with this email already exists'],
          oldInput: {
            firstName,
            lastName,
            email,
            password: '',
            UserType
          }
        });
      }

      // Hash password and create user
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        UserType
      });

      await user.save();
      console.log('User registered successfully:', { firstName, lastName, email, UserType });
      res.redirect("/login");

    } catch (err) {
      console.error('Signup error:', err);
      return res.status(500).render('auth/signup', {
        pageTitle: 'Sign Up',
        isLoggedIn: false,
        errors: ['Registration failed. Please try again.'],
        oldInput: {
          firstName: req.body.firstName || '',
          lastName: req.body.lastName || '',
          email: req.body.email || '',
          password: '',
          UserType: req.body.UserType || ''
        }
      });
    }
  }
];
