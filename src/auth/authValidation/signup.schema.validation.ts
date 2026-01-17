import z, { email } from "zod";


export const signupSchema = z.object({
    email:z.email(),
    name:z.string(),
    password:z.string(),
    confirmPassword:z.string(),
    age:z.number().positive()
}).superRefine((args,ctx)=>{
    if (args.password != args.confirmPassword) {
        ctx.addIssue({
            code:'custom',
            path: ['confirmPassword'],
            message: 'confirmPassword not equal password'
        })
    }
})