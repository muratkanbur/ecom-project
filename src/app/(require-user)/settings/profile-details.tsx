"use client";

import type { UserAddress } from "@/lib/auth0-management";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveAddress } from "./action";

type ProfileDetailsProps = {
  name?: string;
  email?: string;
  address: UserAddress;
};

export function ProfileDetails({ name, email, address }: ProfileDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <section className="mb-8 rounded-lg border p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium">Profile</h2>
        <Button
          type="button"
          variant="outline"
          aria-label="Edit profile"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Pencil aria-hidden="true" />
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>

      <p className="mb-2">
        <span className="font-medium">Name: </span>
        {name || "Not specified"}
      </p>

      <p className="mb-4">
        <span className="font-medium">E-mail: </span>
        {email || "Not specified"}
      </p>

      {isEditing ? (
        <form action={saveAddress} className="space-y-4">
          <div>
            <label htmlFor="street" className="mb-1 block font-medium">
              Address
            </label>
            <input
              id="street"
              name="street"
              type="text"
              maxLength={255}
              defaultValue={address.street}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="city" className="mb-1 block font-medium">
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              maxLength={100}
              defaultValue={address.city}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="postalCode" className="mb-1 block font-medium">
              Postal Code
            </label>
            <input
              id="postalCode"
              name="postalCode"
              type="text"
              maxLength={32}
              defaultValue={address.postalCode}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <Button type="submit">Save</Button>
        </form>
      ) : (
        <div>
          <p>
            <span className="font-medium">Address: </span>
            {address.street || "Not specified"}
          </p>
          <p>
            <span className="font-medium">City: </span>
            {address.city || "Not specified"}
          </p>
          <p>
            <span className="font-medium">Postal Code: </span>
            {address.postalCode || "Not specified"}
          </p>
        </div>
      )}
    </section>
  );
}
