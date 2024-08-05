import { createClient } from "@/utils/supabase/server";
import ProfileCard from "@/components/profileCard";

export default async function Home() {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	return (
		<main>
			<ProfileCard user={user} />
		</main>
	);
}
