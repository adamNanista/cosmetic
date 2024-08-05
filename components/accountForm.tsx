"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { type User } from "@supabase/supabase-js";
import Avatar from "./avatar";

export default function AccountForm({ user }: { user: User | null }) {
	const supabase = createClient();

	const [loading, setLoading] = useState(true);
	const [fullname, setFullname] = useState<string | null>(null);
	const [username, setUsername] = useState<string | null>(null);
	const [website, setWebsite] = useState<string | null>(null);
	const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

	const getProfile = useCallback(async () => {
		try {
			setLoading(true);

			const { data, error, status } = await supabase.from("profiles").select(`full_name, username, website, avatar_url`).eq("id", user?.id).single();

			if (error && status !== 406) {
				console.log(error);
				throw error;
			}

			if (data) {
				setFullname(data.full_name);
				setUsername(data.username);
				setWebsite(data.website);
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

	async function updateProfile({ username, fullname, website, avatarUrl }: { username: string | null; fullname: string | null; website: string | null; avatarUrl: string | null }) {
		try {
			setLoading(true);

			const { error } = await supabase.from("profiles").upsert({
				id: user?.id as string,
				full_name: fullname,
				username,
				website,
				avatar_url: avatarUrl,
				updated_at: new Date().toISOString(),
			});
			if (error) throw error;
			alert("User data updated");
		} catch (error) {
			alert("Error updating user data");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div>
			<label>Email</label>
			<input type="text" value={user?.email} disabled className="border border-neutral-200" />
			<label>Full Name</label>
			<input type="text" value={fullname || ""} onChange={(e) => setFullname(e.target.value)} className="border border-neutral-200" required />
			<label>Username</label>
			<input type="text" value={username || ""} onChange={(e) => setUsername(e.target.value)} className="border border-neutral-200" required />
			<label>Website</label>
			<input type="url" value={website || ""} onChange={(e) => setWebsite(e.target.value)} className="border border-neutral-200" />
			<Avatar
				uid={user?.id ?? null}
				url={avatarUrl}
				size={150}
				onUpload={(url) => {
					setAvatarUrl(url);
					updateProfile({ fullname, username, website, avatarUrl });
				}}
			/>
			<button onClick={() => updateProfile({ username, fullname, website, avatarUrl })} disabled={loading}>
				{loading ? "Loading..." : "Update"}
			</button>
		</div>
	);
}
