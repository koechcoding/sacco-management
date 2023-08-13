import validateUser from "../Helpers/user.validate";
import { Request, Response, NextFunction } from "express";
import UserModel from "../Models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../DatabaseHelpers/db-connection";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../../.env") });


export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
       
        const user = new UserModel(
            uuidv4(),
            name,
            email,
            hashedPassword,
            new Date().toISOString(),
            new Date().toISOString(),
            "0",
            "0",
            "0",

        );

        const { error } = validateUser(user);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // check for connection to db
        if (!db.checkConnection()) {
            return res.status(500).json({ message: "Internal server error db connection" });
        }

        const userRegistered = await db.exec("insertOrUpdateUser", {
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            is_admin: user.is_admin,
            is_deleted: user.is_deleted,
            is_sent: user.is_sent,
            created_at: user.created_at.toString(),
            updated_at: user.updated_at.toString()
        });

        if (userRegistered) {
            const token = jwt.sign(
                { id: user.id, email: user.email, name: user.name },
                process.env.JWT_SECRET as string,
                {
                    expiresIn: "1h",
                }
            );
            return res.status(201).json({ message: "User registered", token, user });
        }
        else {
            return res.status(500).json({ message: "Internal server error" });
        }



    }
    catch (err: any) {
        res.status(500).json({ message: err.message });
    }

}


export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!db.checkConnection()) {
            return res.status(500).json({ message: "Internal server error" });
        }

        const user: UserModel[] = await db.exec("getUserByEmail", { email: email }) as unknown as UserModel[];

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const validPassword = await bcrypt.compare(password, user[0].password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { id: user[0].id, email: user[0].email, name: user[0].name },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "5h",
            }
        );
        return res.status(200).json({ message: "User logged in", token, user });
    }
    catch (err: any) {
        res.status(500).json({ message: err.message });
    }

}


export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!db.checkConnection()) {
            return res.status(500).json({ message: "Internal server error" });
        }

        const user: UserModel = await db.exec("getUserById", { id: id }) as unknown as UserModel;

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User found", user });
    }
    catch (err: any) {
        res.status(500).json({ message: err.message });
    }

}


export const getAllUsers = async (req: Request, res: Response) => {
    try {
        if (!db.checkConnection()) {
            return res.status(500).json({ message: "Internal server error" });
        }

        const users: UserModel[] = await db.exec("getAllUsers", {}) as unknown as UserModel[];

        if (!users) {
            return res.status(400).json({ message: "No users found" });
        }

        return res.status(200).json(users);
    }
    catch (err: any) {
        res.status(500).json({ message: err.message });
    }

}


export const updateUser = async (req: Request, res: Response) => {
    try {

        if (!db.checkConnection()) {
            return res.status(500).json({ message: "Internal server error" });
        }

        const { id } = req.params;
        // get user from db

        const user: UserModel[] = await db.exec("getUserById", { id: id }) as unknown as UserModel[];

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const { name, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
       
        
        const updatedUser = new UserModel(
            user[0].id,
            name,
            email,
            hashedPassword,
            new Date(user[0].created_at).toISOString(),
            new Date().toISOString(),
            user[0].is_sent.toString()==='false'?'0':'1',
            user[0].is_admin.toString()==='false'?'0':'1',
            user[0].is_deleted.toString()==='false'?'0':'1'

        );

        console.log(updatedUser)


        const { error } = validateUser(updatedUser);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const userUpdated = await db.exec("insertOrUpdateUser", {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            password: updatedUser.password,
            is_admin: updatedUser.is_admin,
            is_deleted: updatedUser.is_deleted,
            is_sent: updatedUser.is_sent,
            created_at: updatedUser.created_at,
            updated_at: updatedUser.updated_at,
        });


        if (userUpdated) {
            return res.status(200).json({ message: "User updated", user: updatedUser });
        }
        else {
            return res.status(500).json({ message: "Internal server error" });
        }




    }
    catch (err: any) {
        res.status(500).json({ message: err.message });
    }

}


export const deleteUser = async (req: Request, res: Response) => {

    try {
        const { id } = req.params;

        if (!db.checkConnection()) {
            return res.status(500).json({ message: "Internal server error" });
        }

        const user: UserModel = await db.exec("getUserById", { id: id }) as unknown as UserModel;

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const userDeleted = await db.exec("deleteUser", { id: id });

        if (userDeleted) {
            return res.status(200).json({ message: "User deleted" });
        }
        else {
            return res.status(500).json({ message: "Internal server error" });
        }

    }
    catch (err: any) {
        res.status(500).json({ message: err.message });
    }

}