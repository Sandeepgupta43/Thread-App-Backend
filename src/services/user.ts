import { User } from "../Model/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface CreateUserPayload {
    id?: number;
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
    imageProfileURL?: string;
}

export interface GetUserToken {
    email: string;
    password: string;
}

class UserService {
    public static async createUser(payload: CreateUserPayload) {
        const { firstName, lastName, email, password } = payload;

        // Basic validations
        if (!firstName || firstName.trim().length === 0) {
            throw new Error("First name is required.");
        }

        if (!email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            throw new Error("A valid email is required.");
        }

        if (!password || password.length < 6) {
            throw new Error("Password must be at least 6 characters long.");
        }

        // Check for existing user
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new Error("Email already in use.");
        }

        // Hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        return User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            salt,
        });
    }

    public static async getUserToken(payload: GetUserToken) {
        const { email, password } = payload;

        if (!email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            throw new Error("A valid email is required.");
        }

        if (!password || password.length < 6) {
            throw new Error("Password must be at least 6 characters long.");
        }

        // Check for existing user
        const existingUser = await User.findOne({ where: { email } });
        if (!existingUser?.dataValues) {
            throw new Error("Invailed Email");
        }
        const user = existingUser?.dataValues;

        const userSalt = user.salt;
        const hashedPassword = await bcrypt.hash(password, userSalt);

        if (user.password !== hashedPassword) {
            throw new Error("Incorrect Password");
        }

        const JWT_SERCET_KEY = process.env.JWT_SERCET_KEY || "default";
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SERCET_KEY
        );

        return token;
    }
}

export default UserService;
