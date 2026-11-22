"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth0";
import { saveUserAddress, type UserAddress } from "@/lib/auth0-management";

export async function saveAddress(formData: FormData): Promise<void> {
  const user = await requireUser();

  if (!user.sub) {
    throw new Error("Authenticated user is missing an Auth0 user ID");
  }

  const street = formData.get("street");
  const city = formData.get("city");
  const postalCode = formData.get("postalCode");

  if (
    typeof street !== "string" ||
    typeof city !== "string" ||
    typeof postalCode !== "string"
  ) {
    redirect("/settings?error=invalid");
  }

  const address: UserAddress = {
    street: street.trim(),
    city: city.trim(),
    postalCode: postalCode.trim(),
  };

  if (
    address.street.length > 255 ||
    address.city.length > 100 ||
    address.postalCode.length > 32
  ) {
    redirect("/settings?error=invalid");
  }

  await saveUserAddress(user.sub, address);
  redirect("/settings");
}
