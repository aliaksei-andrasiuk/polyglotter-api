import mongoose from 'mongoose';

const users = new mongoose.Schema({
    tgId: {
        required: true,
        type: String
    },
    id: {
        required: true,
        type: String,
    }
});

export const UsersModel = mongoose.model('users', users)
