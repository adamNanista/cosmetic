import ProfileCard from "@/components/profileCard";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	return <ProfileCard user={user} />;
}
