"use client";

import dynamic from "next/dynamic";
import "@sendbird/uikit-react/dist/index.css";

export default function MessagingApp () {

	const SendbirdApp = dynamic(
		async () => (await import("@sendbird/uikit-react")).App,
		{ ssr: false }
	);

    return (
        <div style={{ height: '100vh' }}>
            <SendbirdApp
                appId={ process.env.NEXT_PUBLIC_SENDBIRD_APP_ID as string }
                userId="sendbird_desk_agent_id_cee60c90-bb6f-47f6-96f1-b60649cd886f"
				accessToken={ process.env.NEXT_PUBLIC_SENDBIRD_ACCESS_TOKEN as string }
            />
        </div>
    );
}