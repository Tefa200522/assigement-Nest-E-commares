import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DBRepo } from "./DB.repo";
import { Order } from "../models/order.model";




@Injectable()
export class OrderRepo extends DBRepo <Order> {
    constructor(@InjectModel(Order.name) private readonly orderModel:Model<Order>) {
        super(orderModel)
    }

}