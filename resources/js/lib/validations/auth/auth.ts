


 
import { RoleValues } from "@/config/enums/Roles";
import * as z from "zod";
import { fotoSchema } from "../app/fileValidate";

export const loginSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(8),
  remember_token: z.boolean().optional()
});

export const registerCreateSchema = z.object({
    id: z.number().optional(),
    
  name: z.string().min(4, "Name is required"),
  email: z.string().min(3, "email is required"),
  password: z.string().min(8, "password min 8"),
  password_confirmation: z.string().min(8, "password min 8"),
 
  foto: fotoSchema,
   roles: z.enum(RoleValues),
   primary_role: z.enum(RoleValues).optional(),
    created_at: z.string().optional(),
     updated_at: z.string().optional(),
});



export type LoginSchema = z.infer<typeof loginSchema>;
export type UserSchema = z.infer<typeof registerCreateSchema>;