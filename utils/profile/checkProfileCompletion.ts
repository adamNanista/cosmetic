import { createClient } from "../supabase/server";

export async function checkProfileCompletion(userId: string) {
	const supabase = createClient();

	const { data, error, status } = await supabase.from("profiles").select(`username, full_name`).eq("id", userId).single();

	if (data?.username && data?.full_name) {
		return true;
	}

	return false;
}
