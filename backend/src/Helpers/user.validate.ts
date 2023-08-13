import UserModel from "../Models/user.model";
import Joi from "joi";

const userSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    is_admin: Joi.string().required(),
    is_deleted: Joi.string().required(),
    is_sent: Joi.string().required(),
    created_at: Joi.string().required(),
    updated_at: Joi.string().required(),
    id: Joi.string().required()
})

const validateUser = (user:UserModel) => {
    return userSchema.validate(user)
}

export default validateUser