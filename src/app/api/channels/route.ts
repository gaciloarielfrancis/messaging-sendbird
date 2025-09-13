import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { TChannel } from "@/types/channel";

export async function GET () {
    const channel = await prisma.channel.findMany();
    return NextResponse.json(channel);
}

export async function POST (req: Request) {
    const data = await req.json() as TChannel;
    const channel = await prisma.channel.findFirst({
        where: { channelUrl: data.channelUrl },
    });
    if(!channel) {
        const newChannel = await prisma.channel.create({ data });
        return NextResponse.json(newChannel);
    }else{
        return NextResponse.json(`Channel already exists.`);
    }
}

export async function PATCH (req: Request) {
    const body = await req.json() as TChannel;
    const { channelUrl, ...data } = body;
    const channel = await prisma.channel.findFirst({ where: { channelUrl } });
    if(channel) {
        const { channelId } = channel;
        try {
            await prisma.channel.update({
                where: { channelId }, 
                data
            });
            return NextResponse.json({ success: true, message: `Channel was successfully saved.` });
        } catch (error) {
            return NextResponse.json(error);
        }
    }
    return NextResponse.json({ success: false, message: `User details can't find.` });
}