import { Conversation } from "../models/conversation.models.js";
import { Message } from "../models/message.models.js";

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
        await conversation.save();
        await newMessage.save();
        
        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in send message controller" ,error.message)
        res.status(500).json({error: error.message})
    }
}

export {
    sendMessage
}