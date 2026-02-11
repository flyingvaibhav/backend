import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { env } from '../config/env.js';

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        avatar: {
            type: String, // cloudinary url
            default: '',
        },
        coverImage: {
            type: String, // cloudinary url
            default: '',
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Video',
            },
        ],
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        refreshToken: {
            type: String,
        },

    },
    {
        timestamps: true,
    }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
            role: this.role,
        },
        env.accessTokenSecret,
        {
            expiresIn: env.accessTokenExpiry,
        }
    );
};
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        env.refreshTokenSecret,
        {
            expiresIn: env.refreshTokenExpiry,
        }
    );
};

export const User = mongoose.model('User', userSchema);