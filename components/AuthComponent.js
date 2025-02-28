"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthComponent() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p className="text-center text-xl">Loading session...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Welcome to Haboubz Haul!</h1>

        {session ? (
          <>
            <p className="mb-4">Signed in as <b>{session.user?.email}</b></p>
            <button 
              onClick={() => signOut()}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <p className="mb-4">You are not signed in.</p>
            <button 
              onClick={() => signIn("google")}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Sign in with Google
            </button>
          </>
        )}
      </div>
    </div>
  );
}
