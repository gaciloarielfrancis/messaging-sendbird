import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { TUser } from "@/types/user";

export async function GET () {
    const messages = await prisma.user.findMany();
    return NextResponse.json(messages);
}

export async function POST (req: Request) {
    const data = await req.json() as TUser;
    const existUser = await prisma.user.findFirst({
        where: { sendbirdId: data.sendbirdId },
    });
    if(!existUser) {
        const newUser = await prisma.user.create({ data });
        return NextResponse.json(newUser);
    }else{
        return NextResponse.json(`User already exists.`);
    }
    
}

export async function PATCH (req: Request) {
    const body = await req.json() as TUser;
    const { sendbirdId, ...data } = body;
    const user = await prisma.user.findFirst({ where: { sendbirdId } });
    if(user) {
        const { userId } = user;
        try {
            await prisma.user.update({
                where: { userId }, 
                data
            });
            return NextResponse.json({ success: true, message: `User details was successfully saved.` });
        } catch (error) {
            return NextResponse.json(error);
        }
    }
    return NextResponse.json({ success: false, message: `User details can't find.` });
}