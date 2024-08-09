"use client";

import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function ProfileListAvatar({ avatarUrl }: { avatarUrl: string | null }) {
	const supabase = createClient();

	const [downloadedAvatarUrl, setDownloadedAvatarUrl] = useState<string | null>(null);

	useEffect(() => {
		async function downloadImage(path: string) {
			try {
				const { data, error } = await supabase.storage.from("avatars").download(path);

				if (error) {
					console.log(error);
					throw error;
				}

				if (data) {
					const url = URL.createObjectURL(data);
					setDownloadedAvatarUrl(url);
				}
			} catch (error) {
				console.log("Error downloading image: ", error);
			}
		}

		if (avatarUrl) downloadImage(avatarUrl);
	}, [avatarUrl, supabase]);

	return downloadedAvatarUrl ? <Image src={downloadedAvatarUrl} alt="Avatar" width="48" height="48" className="w-12 h-12 rounded-full" /> : <div className="w-12 h-12 bg-neutral-200 rounded-full animate-pulse"></div>;
}
