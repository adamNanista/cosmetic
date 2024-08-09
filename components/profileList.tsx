import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";
import ProfileListAvatar from "./profileListAvatar";

export default async function ProfileList({ user }: { user: User | null }) {
	const supabase = createClient();

	const { data, error } = await supabase.from("profiles").select().neq("id", user?.id);

	if (error) {
		console.log(error);
		return <div>There was a problem</div>;
	}

	return (
		<ul className="max-w-lg mx-auto space-y-4">
			{data.map((profile) => {
				return (
					<li key={profile.id}>
						<div className="flex items-center p-4 space-x-4 border border-neutral-200 rounded-lg">
							<div>
								<ProfileListAvatar avatarUrl={profile.avatar_url} />
							</div>
							<div>
								<h1 className="text-lg font-bold">{profile.full_name}</h1>
								<p className="text-neutral-500 text-sm">@{profile.username}</p>
							</div>
						</div>
					</li>
				);
			})}
		</ul>
	);
}
