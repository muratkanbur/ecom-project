import { requireUser } from "@/lib/auth0";
import { getUserAddress } from "@/lib/auth0-management";
import { ProfileDetails } from "./profile-details";

export default async function UserSettingsPage() {
  const user = await requireUser();

  if (!user.sub) {
    throw new Error("Authenticated user is missing an Auth0 user ID");
  }

  const address = await getUserAddress(user.sub);
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 p-6">
      <h1 className="mb-6 text-2xl font-semibold">Profile and Settings</h1>

      <ProfileDetails name={user.name} email={user.email} address={address} />
    </main>
  );
}
