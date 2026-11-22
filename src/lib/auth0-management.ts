import "server-only";

function getAuth0Domain(): string {
  const configuredDomain = process.env.AUTH0_DOMAIN;
  if (!configuredDomain) {
    throw new Error("AUTH0_DOMAIN is not configured");
  }
  return configuredDomain.startsWith("http")
    ? configuredDomain.replace(/\/+$/, "")
    : `https://${configuredDomain}`;
}

export async function getManagementToken(): Promise<string> {
  const clientId = process.env.AUTH0_MANAGEMENT_CLIENT_ID;
  const clientSecret = process.env.AUTH0_MANAGEMENT_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Auth0 Management API credentials are not configured");
  }

  const domain = getAuth0Domain();
  const response = await fetch(`${domain}/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      audience: `${domain}/api/v2/`,
      grant_type: "client_credentials",
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Could not get an Auth0 Management API token (${response.status})`,
    );
  }

  const result: unknown = await response.json();

  if (
    typeof result !== "object" ||
    result === null ||
    !("access_token" in result) ||
    typeof result.access_token !== "string"
  ) {
    throw new Error("Auth0 token response did not contain an access token");
  }
  return result.access_token;
}

export type UserAddress = {
  street: string;
  city: string;
  postalCode: string;
};

type Auth0User = {
  user_metadata?: {
    address?: Partial<UserAddress>;
  };
};

export async function getUserAddress(userId: string): Promise<UserAddress> {
  const domain = getAuth0Domain();
  const token = await getManagementToken();

  const response = await fetch(
    `${domain}/api/v2/users/${encodeURIComponent(userId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Could not load user address (${response.status})`);
  }

  const user = (await response.json()) as Auth0User;
  const address = user.user_metadata?.address;

  return {
    street: address?.street ?? "",
    city: address?.city ?? "",
    postalCode: address?.postalCode ?? "",
  };
}

export async function saveUserAddress(
  userId: string,
  address: UserAddress,
): Promise<void> {
  const domain = getAuth0Domain();
  const token = await getManagementToken();

  const response = await fetch(
    `${domain}/api/v2/users/${encodeURIComponent(userId)}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_metadata: { address },
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Could not save user address (${response.status})`);
  }
}
