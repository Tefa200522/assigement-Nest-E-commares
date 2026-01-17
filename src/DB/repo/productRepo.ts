import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DBRepo } from "./DB.repo";
import { Model } from "mongoose";
import { Product } from "../models/productModel";




@Injectable()
export class ProductRepo extends DBRepo<Product>{
    constructor(@InjectModel(Product.name) private readonly productModel:Model<Product>){
        super(productModel)
    }

}