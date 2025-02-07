import userModel from "../model/userModel.js";
import { hashPassword, comparePassword } from "../helpers/authhelper.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    // Log the incoming request
    console.log('Request received at register controller');
    console.log(req.body);  // Check the actual data being sent

    const { name, email, password, phone, address } = req.body;

    // Validate input fields
    if (!name) {
      return res.status(400).send({ message: 'Name is required' });
    }
    if (!email) {
      return res.status(400).send({ message: 'Email is required' });
    }
    if (!password) {
      return res.status(400).send({ message: 'Password is required' });
    }
    if (!phone) {
      return res.status(400).send({ message: 'Phone is required' });
    }
    if (!address) {
      return res.status(400).send({ message: 'Address is required' });
    }

    // Check for existing user
    console.log('Checking for existing user');
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: 'Already Registered',
      });
    }

    // Register user
    console.log('Hashing password');
    const hashedPassword = await hashPassword(password);

    // Log hashed password
    console.log('Hashed Password:', hashedPassword);

    console.log('Saving new user to database');
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: 'User Registered Successfully',
      user,
    });

  } catch (error) {
    // Log any errors
    console.error('Error in registration:', error);
    res.status(500).send({
      success: false,
      message: 'Error in registration',
      error,
    });
  }
};

export const loginController = async (req, res) => {
  // Placeholder for login controller

    try {
        const {email,password}=req.body
        if(!email||!password){
            return res.status(404).send({
                success:false,
                message:"Invalid email or password"
            })
        }
        const user=await userModel.findOne({email})
        if(!user){
            return res.status(404).send({
                success:false,
                message:"Email is not registerd"
            })
        }
        const match=await comparePassword(password,user.password)
        if(!match){
            return res.status(200).send({
                success:false,
                message:"Invalid Password"
            })
        }
        const token=JWT.sign({_id:user._id},process.env.SECRET,
            {expiresIn:"7d",})
            res.status(200).send({
                success:true,
                message:"User Login Successfully",
                user:{
                    name:user.name,
                    email:user.email,
                    phone:user.phone,
                    address:user.address,
                    role:user.role
                },
                token,
            })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error Occured',
            error
        })
    }

};

export const updateProfileController = async (req, res) => {
    try {
      const { name, phone, address } = req.body;
      const userId = req.user._id; // The user ID is obtained from the decoded token (middleware)
  
      // Validate if user is providing any updates
      if (!name && !phone && !address) {
        return res.status(400).json({
          success: false,
          message: 'Please provide at least one field to update (name, phone, or address).',
        });
      }
  
      // Find the user and update the profile
      const user = await userModel.findByIdAndUpdate(
        userId,
        { 
          ...(name && { name }),    // Update only if 'name' is provided
          ...(phone && { phone }),  // Update only if 'phone' is provided
          ...(address && { address }) // Update only if 'address' is provided
        },
        { new: true } // Return the updated document
      );
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      res.json({ 
        success: true, 
        message: 'Profile updated successfully', 
        user 
      });
      
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ success: false, message: 'Error updating profile', error });
    }
  };
  


  export const changePasswordController = async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user._id; // Get the user ID from the token (assuming middleware)
  
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      // Check if the current password is correct
      const isMatch = await comparePassword(currentPassword, user.password);
      if (!isMatch) {
        return res.status(200).json({ success: false, message: 'Wrong current password' });
      }
  
      // Hash the new password and update it in the database
      const hashedNewPassword = await hashPassword(newPassword);
      user.password = hashedNewPassword;
      await user.save();
  
      res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ success: false, message: 'Error changing password', error });
    }
  };