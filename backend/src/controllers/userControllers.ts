import { Request, Response } from 'express';
import User from '../config/models/userModel';
import { sendEmail } from '../services/mailService';
import jwt from 'jsonwebtoken';

// For forgot password user
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            res.status(404).json({ status: 'error', message: 'User not found' });
            return;
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

        user.resetToken = token;
        user.resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await user.save();

        const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
        await sendEmail(
            user.email,
            "Password Reset Request",
            `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
        );

        res.status(200).json({ status: 'success', message: 'Password reset link sent to email.' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error processing request.' });
    }
};



export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token, newPassword } = req.body;

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

        const user = await User.findOne({
            _id: decoded.id, resetToken: token, resetTokenExpiry: { $gt: new Date() }
        });

        if (!user) {
            res.status(400).json({ status: 'error', message: "Invalid or expired token." });
            return;
        }

        user.password = newPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.status(200).json({ status: 'success', message: 'Password reset successfully.' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error resetting password.' });
    }
}