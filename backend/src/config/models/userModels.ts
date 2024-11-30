import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from "bcrypt";

// Define an interface for the User document
interface IUser extends Document {
    name: string;
    email: string;
    phone: number;
    password: string;
    comparePassword(password: string): Promise<boolean>;
    createdAt: Date;
}

// Create a Schema corresponding to the IUser interface
const UserSchema: Schema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true },
    password: { type: String, required: true, minlength: 8 },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


// Hash passwordd before saving 
UserSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
UserSchema.methods.comparePassword = function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
}

// Create and export the User model
const User = mongoose.model<IUser>('User', UserSchema);
export default User;
