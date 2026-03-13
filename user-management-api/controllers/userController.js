const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({ message: 'All fields are required' });
        }

        const userExists = await User.find({ email });
        if(userExists.length > 0){
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 16);

        const newUser = new User({
            name, 
            email, 
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });

    }catch(err){
        res.status(500).json({ message: 'Server error' });
    }
}

exports.loginUser = async (req, res) => {
    try{
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({
            userId: user._id,
            email: user.email
        }, process.env.JWT_SECRET, 
        { expiresIn: '1d'});

        res.status(200).json({ message: 'Login successful', token });
    }catch(err){
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getAllUsers = async (req, res) => {
    try{
        const users = await User.find().select('-password');
        res.status(200).json(users);
    }catch(err){
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getUserById = async (req, res) => {
    try{
        const user = await User.findById(req.params.id).select('-password');
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    }catch(err){
        res.status(500).json({ message: 'Server error' });
    }
}

exports.updateUser = async (req, res) => {
    try{
        const { name, email } = req.body;
        const updatedData = {};
        
        if(name) updatedData.name = name;
        if(email) updatedData.email = email;

        const user = await User.findByIdAndUpdate(req.params.id, updatedData, { new: true }).select('-password');           
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully', user });
    }catch(err){
        res.status(500).json({ message: 'Server error' });
    }
}

exports.deleteUser = async (req, res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    }catch(err){
        res.status(500).json({ message: 'Server error' });
    }
}