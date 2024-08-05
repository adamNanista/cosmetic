import { signOut } from "./actions";

export default function SignOutForm() {
	return (
		<form>
			<button className="text-red-500 text-sm" formAction={signOut}>
				Sign out
			</button>
		</form>
	);
}
