import { requireUser } from "@/lib/auth0";

export default async function UserOrdersPage() {
  await requireUser;
  return <p>This is user orders page</p>;
}
