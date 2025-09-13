"use client";

import dynamic from "next/dynamic";
import "@sendbird/uikit-react/dist/index.css";
import type { TUser } from "@/types/user";
import { useEffect } from "react";

type TSendbirdUser = {
    userId: string
    nickname: string
    plainProfileUrl: string
}

export default function MessagingApp () {

    const applicationId = process.env.NEXT_PUBLIC_SENDBIRD_APP_ID as string;
    const accessToken = process.env.NEXT_PUBLIC_SENDBIRD_ACCESS_TOKEN as string;
    const userId = process.env.NEXT_PUBLIC_SENDBIRD_USER_ID as string;
    const apiToken = process.env.NEXT_PUBLIC_SENDBIRD_API_TOKEN as string;
	const SendbirdApp = dynamic(
		async () => (await import("@sendbird/uikit-react")).App,
		{ ssr: false }
	);

    function editProfileSuccess (user: TSendbirdUser): void {
        const { nickname, ...data } = user;
        saveUserProfile({
            sendbirdId: data.userId,
            nickname,
            profilePhotoUrl: data.plainProfileUrl
        }, true);
    }

    async function saveUserProfile (user: TUser, isUpdate: boolean = false): Promise<void> {
        const response = await fetch(`/api/users`, { 
            method: isUpdate ? `PATCH` : `POST`, 
            body: JSON.stringify(user) 
        });
        if(response.ok)
            console.log(!isUpdate ? `Saving profile if not exist was success.` : `Updating profile success.`, response);
        else console.error(response.statusText);
    }

    useEffect(() => {
        fetch(`https://api-${ applicationId }.sendbird.com/v3/users/${ userId }`, {
            headers: {
                "Api-Token": apiToken,
                "Content-Type": `application/json`,
            }
        }).then(async response => {
            const user = await response.json();
            saveUserProfile({
                nickname: user.nickname,
                profilePhotoUrl: user.profile_url,
                sendbirdId: user.user_id
            });
        });
    }, [ applicationId, userId, apiToken ])

    return (
        <div style={{ height: `100vh` }}>
            <SendbirdApp
                appId={ applicationId }
                userId={ userId }
				accessToken={ accessToken }
                allowProfileEdit={ true }
                onProfileEditSuccess={ editProfileSuccess }
                
            />
        </div>
    );
}