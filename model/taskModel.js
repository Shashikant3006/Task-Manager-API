import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", required: true 
    }, // User association
    title: { 
        type: String, 
        required: true
    },
    description: { 
        type: String 
    },
  }, { timestamps: true });
export default mongoose.model("tasks", taskSchema);