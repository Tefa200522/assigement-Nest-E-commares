import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DBRepo } from "./DB.repo";
import { Model } from "mongoose";
import { Cart } from "../models/cart.model";




@Injectable()
export class CartRepo extends DBRepo<Cart>{
    constructor(@InjectModel(Cart.name) private readonly cartModel:Model<Cart>){
        super(cartModel)
    }

}