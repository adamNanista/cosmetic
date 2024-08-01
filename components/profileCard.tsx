"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { type User } from "@supabase/supabase-js";
import Link from "next/link";

export default function ProfileCard({ user }: { user: User | null }) {
	const supabase = createClient();

	const [loading, setLoading] = useState(true);
	const [fullname, setFullname] = useState<string | null>(null);

	const getProfile = useCallback(async () => {
		try {
			setLoading(true);

			const { data, error, status } = await supabase.from("profiles").select(`full_name`).eq("id", user?.id).single();

			if (error && status !== 406) {
				console.log(error);
				throw error;
			}

			if (data) {
				setFullname(data.full_name);
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

	return (
		<div>
			<h1>{fullname || ""}</h1>
			<Link href="/account">Edit profile</Link>
		</div>
	);
}
