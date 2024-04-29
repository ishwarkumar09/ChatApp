import { Conversation } from "../models/conversation.models.js";
import { Message } from "../models/message.models.js";
import { getReceiverSocketId } from "../socket/socket.js";
import { io } from "../socket/socket.js";

const sendMessage = async(req,res)=>{
    try {
        const {message} = req.body;
        const{id:receiverId} = req.params;
        const senderId = req.user._id

      let conversation = await Conversation.findOne({
            participants:{
                $all:[senderId,receiverId]
            }
        })
        
        if(!conversation){
            conversation =await Conversation.create({participants:[senderId,receiverId]})
        }

        const newMessage = new Message({
            senderId:senderId,
            receiverId:receiverId,
            message:message
        })

        if(newMessage){
            conversation.messages.push(newMessage._id)
        }
 
        //await conversation.save();
        //await newMessage.save();
        
        
        //this will run in parallel
        await Promise.all([conversation.save(),newMessage.save()])
        
        //soket io functionality will go here
         const receiverSocketId = getReceiverSocketId(receiverId);
         if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage" ,newMessage)
         }



        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in send message controller" ,error.message)
        res.status(500).json({error: error.message})
    }
}

const getMessages = async(req,res)=>{
  try {
    const {id:userToChatId} = req.params;
    const senderId = req.user._id;
    
    const conversation = await Conversation.findOne({
        participants:{$all: [senderId ,userToChatId]},
    }).populate("messages");//Not Reference but actual message

    if(!conversation)return res.status(200).json([]);
  
    const message = conversation.messages
    res.status(200)
    .json(message);

    
  } catch (error) {
    console.log("Error in get message controller" ,error.message)
    res.status(500).json({error: error.message})
  }
}
export {
    sendMessage,
    getMessages
}