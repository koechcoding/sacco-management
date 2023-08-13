import { Router } from "express";
import { VerifyToken } from "../Middlewares/VerifyToken";
import { login, register, getUserById, updateUser, deleteUser,getAllUsers } from "../Controller/authController";



const authrouter =Router()

authrouter.post("/login", login);
authrouter.post("/register", register);
authrouter.get("/:id",VerifyToken, getUserById);
authrouter.put("/:id",VerifyToken, updateUser);
authrouter.delete("/:id", VerifyToken,deleteUser);
authrouter.get("/",VerifyToken, getAllUsers);

export default authrouter