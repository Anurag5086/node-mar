const User = require('../models/User');

exports.createUser = async (req, res) => {
    const { name, email, age } = req.body;

    const newUser = new User({
        name,
        email,
        age
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: newUser });
};