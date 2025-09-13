import { NextResponse } from "next/server";

export async function GET() {
    const res = await fetch(
        `https://api-${ process.env.NEXT_PUBLIC_SENDBIRD_APP_ID }.sendbird.com/v3/users`, {
            headers: {
                "Api-Token": process.env.NEXT_PUBLIC_SENDBIRD_API_TOKEN!,
                "Content-Type": `application/json`,
            },
        }
    );
    const data = await res.json();
    return NextResponse.json(data);
}