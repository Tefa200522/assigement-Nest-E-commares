import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { User } from "./schema.usermodel";




export enum otpEnum {
    VERIFY_EMAIL = 'VERIFY_EMAIL',
    RESET_PASSWORD = 'RESET_PASSWORD'
}

@Schema({
    timestamps: true
})
export class OTP {
    @Prop({
        require:true,
        type :Types.ObjectId,
        ref : User.name
    })
    userId: Types.ObjectId


    @Prop({
        type: String,
        required:true
    })

    otp : String
    @Prop({
        type: String,
        required:true,
        enum: Object.values(otpEnum)
    })
    type : otpEnum

    @Prop({
        type:Date,
        require: true
    })
    expireIn : Date

}

export type OTPDocumment = HydratedDocument<OTP>;

export const OTPSchema = SchemaFactory.createForClass(OTP);
OTPSchema.index({
    type: 1,
    userId: 1
},{
    unique: true
})


export const OTPModel = MongooseModule.forFeature([
    {
        name: OTP.name,
        schema: OTPSchema
    }
])