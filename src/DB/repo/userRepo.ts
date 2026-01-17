import { Injectable } from "@nestjs/common";
import { User } from "../models/schema.usermodel";
import { DBRepo } from "./DB.repo";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";


@Injectable()
export class UserRepo extends DBRepo<User> {
    constructor(@InjectModel(User.name)private readonly userModel: Model<User>){
        super(userModel)
    }

    async findByEmail (email: string){
        return await this.findOne({filter :{email}})
    }
}