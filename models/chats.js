import mongoose, {Schema, models} from "mongoose";

const chatSchema = new Schema({
  chats: {
    type: [
      {
        type: String,
        ref: 'chat'
      }
    ],
    default: [],
  }
},{timestamp: true})

const Chat = models.Chat || mongoose.model("Chat", chatSchema);
export default Chat;