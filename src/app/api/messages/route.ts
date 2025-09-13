import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { TMessage } from "@/types/message";

export async function GET () {
    const messages = await prisma.message.findMany();
    return NextResponse.json(messages);
}

export async function POST (req: Request) {
    const data = await req.json() as TMessage;
    const newMessage = await prisma.message.create({ data });
    return NextResponse.json(newMessage);
}

export async function PATCH (req: Request) {
    const body = await req.json() as TMessage;
    const { messageId, ...data } = body;
    try {
        await prisma.message.update({
            where: { messageId }, 
            data
        });
        return NextResponse.json({ success: true, message: `Message was successfully saved.` });
    } catch (error) {
        return NextResponse.json(error);
    }
    
}