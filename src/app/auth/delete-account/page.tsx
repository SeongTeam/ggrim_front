import { DeleteAccountForm } from '../../../components/auth/DeleteAccountForm';

export default function DeleteAccountPage() {
	return (
		<main className="min-h-screen flex items-center justify-center bg-black text-white">
			<div className="w-full max-w-md p-8 bg-zinc-900 rounded-2xl shadow-lg">
				<h1 className="text-2xl font-bold mb-6 text-red-600">Delete Account</h1>
				<DeleteAccountForm />
			</div>
		</main>
	);
}
