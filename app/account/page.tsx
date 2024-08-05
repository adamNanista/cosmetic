import AccountForm from "@/components/accountForm";
import { createClient } from "@/utils/supabase/server";

export default async function Account() {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	return (
		<div>
			<h1>Set up your account</h1>
			<AccountForm user={user} />
		</div>
	);
}
