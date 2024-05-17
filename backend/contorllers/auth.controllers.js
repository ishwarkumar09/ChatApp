import bcrypt from "bcryptjs";
import {User}   from "../models/user.models.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

const signup = async(req ,res)=>{
  try {
    //   console.log(req.body)
   const {fullName,username,password,confirmPassword,gender} = req.body;

   if(password !== confirmPassword){
    return res.status(400).json({error:"Password don't match"})
   }

   const user = await User.findOne({username});
   
   if(user){
    return res.status(400).json({error:"User already exist"})
   }
   //Hash Password here
   const salt =await bcrypt.genSalt(10);
   const hashedPassword = await bcrypt.hash(password ,salt)
   

   const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
   const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`
   
   const newUser = new User({
      fullName,
      username,
      password:hashedPassword,
      gender,
      profilePicture: gender ==="male" ? boyProfilePic : girlProfilePic

   })
 if (newUser){
    // Generate Jwt Token here
   generateTokenAndSetCookie(newUser._id,res)

   await newUser.save();

   res.status(201)
   .json({
    _id:newUser._id,
    fullName:newUser.fullName,
    username:newUser.username,
    profilePicture:newUser.profilePicture
})
 }else{
    res.status(400).json({error:"Invalid user data"})
 }
  
  
  } catch (error) {
    console.log("Error in signup controller" ,error.message)
    res.status(500).json({error: "Internal server error"})
  }
}

const login =async (req ,res)=>{
  try {
    const{username,password} = req.body;
    const user = await User.findOne({username});
    const isPasswordCorrect = await bcrypt.compare(password , user?.password|| "")

     if(!user || !isPasswordCorrect){
        return res.status(400).json({error: "Invalid username or password"})

     }
     generateTokenAndSetCookie(user._id,res);

    res.status(200)
    .json({
        _id:user._id,
        fullName:user.fullName,
        username:user.username,
        profilePicture:user.profilePicture,
    })




  } catch (error) {
    console.log("Error in login controller" ,error.message)
    res.status(500).json({error: "Internal server error"})
  }  
}

const logout = async(req ,res)=>{
   try {
    res.cookie("jwt","",{maxAge:0})
    res.status(200)
    .json({message:"Logged out successfully"});
   } catch (error) {
    console.log("Error in logout controller" ,error.message)
    res.status(500).json({error: "Internal server error"})
   }
}
const updateUserAvatar = async (req, res) => {
  try {
    const { profilePicture } = req.body;

    if (!profilePicture) {
      return res.status(400).json({ message: "Avatar not provided" });
    }

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { $set: { profilePicture: profilePicture } },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Profile picture successfully updated", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export {
    signup,
    login,
    logout,
    updateUserAvatar
}