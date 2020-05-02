const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const isEmpty = require('lodash/isEmpty');

const User = mongoose.model('User');

const validateSignup = (data) => {
    let errors = {};

    if(validator.isEmpty(data.fname)){
        errors.fname = 'This field is required';
    }
    if(validator.isEmpty(data.lname)){
        errors.lname = 'This field is required';
    }
    if(validator.isEmpty(data.brand)){
        errors.brand = 'This field is required';
    }
    if(validator.isEmpty(data.phone)){
        errors.phone = 'This field is required';
    }
    if(!validator.isEmail(data.email)){
        errors.email = 'Email is invalid';
    }
    if(validator.isEmpty(data.email)){
        errors.email = 'This field is required';
    }
    if(validator.isEmpty(data.password)){
        errors.password = 'This field is required';
    }
    if(validator.isEmpty(data.cPassword)){
        errors.cPassword = 'This field is required';
    }
    if(!validator.equals(data.password, data.cPassword)){
        errors.cPassword = 'Password must match';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};


module.exports.signup = async (req, res) => {
    const { errors, isValid } = validateSignup(req.body);

    if(!isValid){
        return res.status(400).json(errors);
    }
    const {fname, lname, brand, phone, email, password} = req.body;
    try{
        const user = new User({fname,lname,brand,phone,email,password});
        await user.save();
        const token = jwt.sign({userId: user._id, fname: user.fname, lname: user.lname}, 'MY_SECRET_KEY');
        return res.send({token});
    }
    catch(err){
        return res.status(422).send({email: 'This email account is already exists.'}); 
    }
};

const validateSignin = (data) => {
    
    let errors = {};
    if(!validator.isEmail(data.email)){
        errors.email = 'Email is invalid';
    }
    if(validator.isEmpty(data.email)){
        errors.email = 'This field is required';
    }
    if(validator.isEmpty(data.password)){
        errors.password = 'This field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};

module.exports.signin = async (req, res) => {
    const { errors, isValid } = validateSignin(req.body);

    if(!isValid){
        return res.status(400).json(errors);
    }
    const { email, password } = req.body;
    const user = await User.findOne({email});
    if(!user){
        return res.status(422).send({error: 'Invalid email or password.'});
    }
    try{
        await user.comparePassword(password);
        const token = jwt.sign({userId: user._id, fname: user.fname, lname: user.lname}, 'MY_SECRET_KEY');
        return res.send({token});
    }
    catch(err){
        return res.status(422).send({error: 'Invalid email or password.'});
    }
};