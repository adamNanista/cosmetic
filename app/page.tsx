import { createClient } from "@/utils/supabase/server";
import ProfileList from "@/components/profileList";

export default async function Home() {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	return (
		<main>
			<ProfileList user={user} />
		</main>
	);
}
