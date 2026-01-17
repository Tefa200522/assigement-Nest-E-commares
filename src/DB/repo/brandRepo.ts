import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DBRepo } from "./DB.repo";
import { Brand } from "../models/brandModel";
import { Model } from "mongoose";




@Injectable()
export class BrandRepo extends DBRepo<Brand>{
    constructor(@InjectModel(Brand.name) private readonly brandModel:Model<Brand>){
        super(brandModel)
    }

}