"use client";

import { App as SendbirdApp, useSendbird } from "@sendbird/uikit-react";
import "@sendbird/uikit-react/dist/index.css";
import GroupChannelHandler from "@sendbird/uikit-react/handlers/GroupChannelHandler";
import type { GroupChannel } from "@sendbird/chat/groupChannel";
import type { TUser } from "@/types/user";
import { useEffect, useRef } from "react";
import { TChannel } from "@/types/channel";
import { TMessage } from "@/types/message";

type TSendbirdUser = {
    userId: string
    nickname: string
    plainProfileUrl: string
}

export default function Chat () {

    const { state } = useSendbird();
    const { appId, userId, accessToken } = state.config;
    const sdk = state.stores.sdkStore.sdk;
    const blockRef = useRef<boolean>(false);
    const channelRef = useRef<string>(``);
    
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
            console.log(!isUpdate ? `Saving profile if not exist was success.` : `Updating profile success.`);
        else console.error(response.statusText);
    }

    useEffect(() => {
        if (blockRef.current) return;
        blockRef.current = true;

        const apiToken = process.env.NEXT_PUBLIC_SENDBIRD_API_TOKEN as string;
        fetch(`https://api-${ appId }.sendbird.com/v3/users/${ userId }`, {
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
    }, [ appId, userId ]);

    useEffect(() => {
        if (Object.keys(sdk).length > 0) {
            const channelHandler = new GroupChannelHandler({
                onMetaDataCreated: channel => {
                    console.log(`METADATA CHANNEL`, channel)
                },
                onChannelChanged: async channelData => {
                    const channel = channelData as GroupChannel;
                    const chatMateId = channel.members.find(member => member.userId !== userId)?.userId ?? ``;
                    console.log(`CHANNEL CHANGED`, channel)
                    if(channelRef.current !== channel.url) {
                        channelRef.current = channel.url;
                        await saveChannel({
                            channelUrl: channel.url,
                            createdById: userId,
                            chatMateId
                        });
                    }
                    
                    await saveMessage({ 
                        channelUrl: channelRef.current, 
                        senderId: userId,
                        message: channel.lastMessage?.message ?? ``
                    });
                },
                onUserLeft: async channelData => {
                    await saveChannel({ channelUrl: channelData.url, isDeleted: true }, true);
                    console.log(`USER LEFT`, channelData)
                }
            });
            sdk.groupChannel.addGroupChannelHandler(new Date().getTime().toString(), channelHandler);
        }

        async function saveChannel (data: TChannel, isDelete: boolean = false): Promise<void> {
            const response = await fetch(`/api/channels`, { method: isDelete ? `PATCH` : `POST`, body: JSON.stringify(data) });
            if(response.ok)
                console.log(isDelete ? `Channel was deleted.` : `Saving channel if not exist was success.`);
            else console.error(response.statusText);
        }

        async function saveMessage (data: TMessage): Promise<void> {
            const response = await fetch(`/api/messages`, { method: `POST`, body: JSON.stringify(data) });
            if(response.ok)
                console.log(`Message saved.`);
            else console.error(response.statusText);
        }
    }, [ sdk, userId ])

    return (
        <div style={{ height: `100vh` }}>
            <SendbirdApp
                appId={ appId }
                userId={ userId }
                accessToken={ accessToken }
                allowProfileEdit={ true }
                onProfileEditSuccess={ editProfileSuccess }
            >
            </SendbirdApp>
            
        </div>
    );
}