"use client";

import { useEffect, useState } from "react";
import { type User } from "@supabase/supabase-js";
import { useProfileData } from "@/utils/profile/useProfileData";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import SignOutForm from "./signOutForm/signOutForm";

export default function ProfileCard({ user }: { user: User | null }) {
	const supabase = createClient();

	const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

	const { data, loading, error } = useProfileData({ user });

	if (error) {
		console.log(error);
		throw error;
	}

	useEffect(() => {
		async function downloadImage(path: string) {
			try {
				const { data, error } = await supabase.storage.from("avatars").download(path);

				if (error) {
					throw error;
				}

				const url = URL.createObjectURL(data);
				setAvatarUrl(url);
			} catch (error) {
				console.log("Error downloading image: ", error);
			}
		}

		if (data?.avatar_url) downloadImage(data.avatar_url);
	}, [data?.avatar_url, supabase]);

	return (
		<div className="flex items-center max-w-lg mx-auto p-4 space-x-4 border border-neutral-200 rounded-lg">
			<div>{avatarUrl ? <Image src={avatarUrl} alt="Avatar" width="48" height="48" className="w-12 h-12 rounded-full" /> : <div className="w-12 h-12 bg-neutral-200 rounded-full animate-pulse"></div>}</div>
			<div className="grow">
				<h1 className="text-lg font-bold">{data?.full_name ? <span>{data.full_name}</span> : <span className="inline-block align-middle w-24 h-3.5 bg-neutral-200 rounded-full animate-pulse"></span>}</h1>
				<p className="text-neutral-500 text-sm">{data?.username ? <span>@{data.username}</span> : <span className="inline-block align-middle w-12 h-2.5 bg-neutral-200 rounded-full animate-pulse"></span>}</p>
			</div>
			<div>
				<SignOutForm />
			</div>
		</div>
	);
}
