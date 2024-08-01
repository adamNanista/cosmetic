"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { type User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";

export default function ProfileCard({ user }: { user: User | null }) {
	const supabase = createClient();

	const [loading, setLoading] = useState(true);
	const [fullname, setFullname] = useState<string | null>(null);
	const [avatar_url, setAvatarUrl] = useState<string | null>(null);
	const [imageUrl, setImageUrl] = useState<string | null>(null);

	const getProfile = useCallback(async () => {
		try {
			setLoading(true);

			const { data, error, status } = await supabase.from("profiles").select(`full_name, avatar_url`).eq("id", user?.id).single();

			if (error && status !== 406) {
				console.log(error);
				throw error;
			}

			if (data) {
				setFullname(data.full_name);
				setAvatarUrl(data.avatar_url);
			}
		} catch (error) {
			alert("Error loading user data");
		} finally {
			setLoading(false);
		}
	}, [user, supabase]);

	useEffect(() => {
		getProfile();
	}, [user, getProfile]);

	useEffect(() => {
		async function downloadImage(path: string) {
			try {
				const { data, error } = await supabase.storage.from("avatars").download(path);

				if (error) {
					throw error;
				}

				const url = URL.createObjectURL(data);
				setImageUrl(url);
			} catch (error) {
				console.log("Error downloading image: ", error);
			}
		}

		if (avatar_url) downloadImage(avatar_url);
	}, [avatar_url, supabase]);

	return (
		<div>
			<Image src={imageUrl || ""} alt="Avatar" width="150" height="150" />
			<h1>{fullname || ""}</h1>
			<Link href="/account">Edit profile</Link>
		</div>
	);
}
