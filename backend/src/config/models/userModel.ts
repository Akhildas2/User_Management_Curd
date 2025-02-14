import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from "bcrypt";

// Define an interface for the User document
interface IUser extends Document {
    name: string;
    email: string;
    phone: number;
    password: string;
    profileImage: string;
    dob: Date;
    gender: string;
    position: string;
    skills: string;
    isAdmin: boolean;
    isBlocked: boolean;
    isVerified: boolean;
    comparePassword(password: string): Promise<boolean>;
    resetToken?: string;
    resetTokenExpiry?: Date;
    createdAt: Date;
}

// Create a Schema corresponding to the IUser interface
const UserSchema: Schema = new Schema<IUser>({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phone: { type: Number, required: true },
    password: { type: String, required: true, minlength: 8 },
    profileImage: { type: String },
    dob: { type: Date },
    gender: { type: String },
    position: { type: String },
    skills: { type: String },
    isAdmin: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
    createdAt: { type: Date, default: Date.now }
});



// Hash passwordd before saving 
UserSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

// Method to compare password
UserSchema.methods.comparePassword = function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
}

// Create and export the User model
const User = mongoose.model<IUser>('User', UserSchema);
export default User;
