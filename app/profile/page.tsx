import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Profile() {
	const supabase = createClient();

	const { data, error } = await supabase.auth.getUser();

	if (error || !data?.user) {
		redirect("/login");
	}

	async function getProfileData(userId: string) {
		const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();

		if (error) {
			console.log(error);

			return null;
		}

		return data;
	}

	const profileData = await getProfileData(data.user.id);

	return <div>{profileData.full_name}</div>;
}
