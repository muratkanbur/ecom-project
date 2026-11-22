import { requireUser } from "@/lib/auth0";

export default async function LoggInUserLayout({ children }: LayoutProps<"/">) {
  await requireUser();
  return <div>{children}</div>;
}
