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
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "default";


class UserService {
    public static async createUser(payload: CreateUserPayload) {
        const { firstName, lastName, email, password } = payload;

        // Validations
        if (!firstName?.trim()) {
            throw new Error("First name is required.");
        }

        if (!email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            throw new Error("A valid email is required.");
        }

        if (!password || password.length < 6) {
            throw new Error("Password must be at least 6 characters long.");
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new Error("Email already in use.");
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            salt,
        });

        return newUser.toJSON(); // Optional: strips off metadata
    }

    public static async getUserToken(payload: GetUserToken) {
        const { email, password } = payload;

        if (!email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            throw new Error("A valid email is required.");
        }

        if (!password || password.length < 6) {
            throw new Error("Password must be at least 6 characters long.");
        }

        const existingUser = await User.findOne({ where: { email } });
        if (!existingUser) {
            throw new Error("Invalid Email.");
        }

        const user = existingUser.get(); // Type-safe way to access fields

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Incorrect Password");
        }

        // const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "default";
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET_KEY,
            { expiresIn: "7d" }
        );

        return token;
    }

    public static async getUserById(id: number) {
        try {
            const res = await User.findOne({where: {id}});
            
            const user = res?.get();
            return user;
        } catch (error) {
            throw new Error("Invalid Id or not found");
        }
    }

    public static async decodeToken(token: string) {
        // const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "default";
        try {
            const decoded = jwt.verify(token, JWT_SECRET_KEY);
            return decoded;
        } catch (err) {
            throw new Error("Invalid or expired token");
        }
    }
}

export default UserService;
