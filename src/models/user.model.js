import mongoose ,{Schema} from "mongoose";
const userSchema = new Schema({
    username: {
        type: String,
         required: true,
          unique: true,
        lowercase: true,
         trim: true,
            
        },
    email: {
        type: String,
         required: true,
          unique: true,
          lowercase: true,
           trim: true 
    },
    fullname: {
        type: String,
         required: true,
            trim: true,
            index: true
    },
    avatar: {
        type: String,// cloudinary url
        required: true
    },
    coverImage: {
        type: String, // cloudinary url
    },
    watchHistory:[ 
        {
        type: Schema.Types.ObjectId,
        ref:"vedio"
    }
    ],
    password: {
        type: String,
         required: true,
    },