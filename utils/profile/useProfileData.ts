"use client";

interface Profile {
	id: string | null;
	username: string | null;
	full_name: string | null;
	avatar_url: string | null;
	website: string | null;
}

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { type User } from "@supabase/supabase-js";

export function useProfileData({ user }: { user: User | null }) {
	const supabase = createClient();

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<any | null>(null);
	const [data, setData] = useState<Profile | null>(null);

	const getProfileData = useCallback(async () => {
		try {
			setLoading(true);

			const { data, error, status } = await supabase.from("profiles").select(`id, username, full_name, avatar_url, website`).eq("id", user?.id).single();

			if (error && status !== 406) {
				console.log(error);
				setError(error);
				throw error;
			}

			if (data) {
				setData(data);
			}
		} catch (error) {
			setError(error);
		} finally {
			setLoading(false);
		}
	}, [user, supabase]);

	useEffect(() => {
		getProfileData();
	}, [user, getProfileData]);

	return { data, loading, error };
}
