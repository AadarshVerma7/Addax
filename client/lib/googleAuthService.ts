const API_URL = process.env.NEXT_PUBLIC_CLIENT_BASE_URL;

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

export interface GoogleAuthResponse {
  token: string;
  user: User;
}

export const googleAuth = async (
  credential: string
): Promise<GoogleAuthResponse> => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/api/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
    body: JSON.stringify({
      credential, 
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Google authentication failed");
  }

  return response.json();
};