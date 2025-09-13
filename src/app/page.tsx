"use client";

import SendbirdProvider from "@sendbird/uikit-react/SendbirdProvider";
import Chat from "@/components/Chat";
import { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";

export default function MessagingApp () {

    const appId = process.env.NEXT_PUBLIC_SENDBIRD_APP_ID as string;
    const accessToken = process.env.NEXT_PUBLIC_SENDBIRD_ACCESS_TOKEN as string;
    // const userId = process.env.NEXT_PUBLIC_SENDBIRD_USER_ID as string;
    const [ userId, setUserId ] = useState<string | null>(null);

    useEffect(() => {
        const apiToken = process.env.NEXT_PUBLIC_SENDBIRD_API_TOKEN as string;
        fetch(`https://api-${ appId }.sendbird.com/v3/users`, {
            method: `POST`,
            headers: {
                "Api-Token": apiToken,
                "Content-Type": `application/json`,
            },
            body: JSON.stringify({
                user_id: new Date().getTime().toString(),
                nickname: faker.person.fullName(),
                profile_url: ``
            })
        }).then(async response => {
            const user = await response.json();
            setUserId(user.user_id);
            
        });
    }, [ appId ])

    return (
        <>
            {
                userId ?
                <SendbirdProvider
                    appId={ appId }
                    userId={ userId }
                    accessToken={ accessToken }
                >
                    <Chat />
                </SendbirdProvider>
                : null
            }
        </>
        
    );
}