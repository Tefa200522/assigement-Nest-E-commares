import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";



export enum GenderEnum{
    MALE ='male',
    FEMALE =' female'
}

@Schema({
    timestamps: true
})

export class User{
    @Prop({
        type:String,
        required: true,
        unique: true
    })
    email: string

     @Prop({
        type:String,
        required: true,
    })
    name: string

     @Prop({
        type:String,
        required: true,
    })
    password: string
     @Prop({
        type:Number,
        min:(16),
        max:(60)
    })
    age: number 


    @Prop({
        type: String,
        default: GenderEnum.MALE
    })
    gender: GenderEnum


    @Prop({
        type: Boolean,
        default: false
    })
    isComfirmed : Boolean

    @Prop({
        type:[mongoose.Schema.Types.ObjectId],
        ref: "proudct"
    })
    favorites:Array<Types.ObjectId>
}

export const userSchema = SchemaFactory.createForClass(User)


export const UserModel = MongooseModule.forFeature([
    {
        name: User.name,
        schema: userSchema
    }
])