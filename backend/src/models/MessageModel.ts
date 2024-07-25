import mongoose, { Document, Schema, model } from "mongoose";

export interface IMessage extends Document {
  sender: string;
  receiver: string;
  text: string;
}

const MessageSchema = new Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  text: { type: String, required: true },
});

const MessageModel = model<IMessage & Document>("Message", MessageSchema);

export default MessageModel;
