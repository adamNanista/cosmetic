import AccountForm from "@/components/accountForm";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function Account() {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	return (
		<div>
			<Link href="/">Home</Link>
			<AccountForm user={user} />
		</div>
	);
}
