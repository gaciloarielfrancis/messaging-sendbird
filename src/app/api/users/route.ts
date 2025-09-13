import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { TUser } from "@/types/user";

export async function GET () {
    const messages = await prisma.user.findMany();
    return NextResponse.json(messages);
}

export async function POST (req: Request) {
    const data = await req.json() as TUser;
    const newMessage = await prisma.user.create({ data });
    return NextResponse.json(newMessage);
}

export async function PATCH (req: Request) {
    const body = await req.json() as TUser;
    const { userId, ...data } = body;
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