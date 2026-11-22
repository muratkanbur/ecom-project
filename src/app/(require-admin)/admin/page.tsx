import { requireUser } from "@/lib/auth0";

export default async function AdminHomePage() {
  await requireUser;
  return <p>This is admin home page</p>;
}
