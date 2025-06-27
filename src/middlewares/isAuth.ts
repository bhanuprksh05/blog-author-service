import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"

interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  image: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  bio: string;
}

export interface UserRequest extends Request {
    user?: IUser
}
const isAuth = async(req: UserRequest,res: Response,next: NextFunction)=>{
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer')){
            res.status(401).json({
                message: "Login first - Token is misssing"
            });
            return;
        }

        const token = authHeader.split(' ')[1];
        
        const decodedValue = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        if(!decodedValue || !decodedValue.user){
            res.status(401).json({
                message: "Invalid token"
            });
            return;
        }

        req.user = decodedValue.user;
        next();

    }catch(err:any){
        res.status(401).json({
            message:err.message
        })
    }
}

export default isAuth;