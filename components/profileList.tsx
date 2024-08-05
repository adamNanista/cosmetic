import { createClient } from "@/utils/supabase/server";

export default async function ProfileList() {
	const supabase = createClient();

	const { data, error } = await supabase.from("profiles").select();

	return (
		<ul className="space-y-4">
			{data?.map((profile) => {
				return (
					<li key={profile.id} className="flex flex-col">
						<span className="text-lg font-bold">{profile.full_name}</span>
						<span className="text-neutral-500 text-sm">@{profile.username}</span>
					</li>
				);
			})}
		</ul>
	);
}
