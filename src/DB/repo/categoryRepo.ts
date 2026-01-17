import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DBRepo } from "./DB.repo";
import { Model } from "mongoose";
import { Category } from "../models/categoryModel";




@Injectable()
export class CategoryRepo extends DBRepo<Category>{
    constructor(@InjectModel(Category.name) private readonly categoryModel:Model<Category>){
        super(categoryModel)
    }

}