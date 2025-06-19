import { DeleteAccountForm } from "../../../components/auth/DeleteAccountForm";

export default function DeleteAccountPage() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-black text-white">
			<div className="w-full max-w-md rounded-2xl bg-zinc-900 p-8 shadow-lg">
				<h1 className="mb-6 text-2xl font-bold text-red-600">Delete Account</h1>
				<DeleteAccountForm />
			</div>
		</main>
	);
}
