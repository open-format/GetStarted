import React, { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useForm } from "react-hook-form";

type FormData = {
  email: string;
  key: string;
};

type User = {
  id: string;
  createdAt: string;
  email: string;
  private_key: string;
};

export const SignUpWithMagicLink: React.FC = () => {
  const [privateKey, setPrivateKey] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null); // Add state to store the signed-in user
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    const handleAuthStateChange = async (event: string, session: any) => {
      if (event === "SIGNED_IN") {
        const user = session.user;
        setIsSignedIn(true);
        setUser(user); // Update the signed-in user state

        // Call the registerUser API route
        const response = await fetch("/api/registerUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user }),
        });

        if (response.ok) {
          const data = await response.json();
          if (!data.existingUser) {
            setPrivateKey(data.privateKey);
            setWalletAddress(data.walletAddress);
          }
        } else {
          setMessage("Error registering user.");
        }
      }
    };

    const authListener = supabase.auth.onAuthStateChange(handleAuthStateChange);
    return () => {
      authListener.data?.subscription.unsubscribe();
    };
  }, []);

  async function signInWithEmail(data: FormData) {
    setLoading(true);
    setMessage("");

    const { email } = data;

    // Call the signInWithMagicLink API route
    const response = await fetch("/api/signInWithMagicLink", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      const data = await response.json();
      setMessage(data.message);
      setWalletAddress(data.walletAddress);
      reset();
    } else {
      const errorData = await response.json();
      setMessage(errorData.error);
    }

    setLoading(false);
  }

  async function getWalletAddress() {
    const response = await fetch("/api/getWalletAddress");

    if (response.ok) {
      const data = await response.json();
      return data.walletAddress;
    } else {
      throw new Error("Error retrieving wallet address.");
    }
  }

  getWalletAddress()
    .then((walletAddress) => {
      console.log("Wallet Address:", walletAddress);
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        {isSignedIn ? (
          <div className="text-center">
            <h3 className="text-2xl font-medium leading-6 text-gray-900 mb-6">
              You are signed in!
            </h3>
          </div>
        ) : (
          <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
            <h3 className="text-2xl font-medium leading-6 text-gray-900 mb-6">
              Sign up with Magic Link
            </h3>

            <form onSubmit={handleSubmit(signInWithEmail)}>
              <div className="space-y-4">
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="block w-full p-2 border border-gray-300 rounded"
                  placeholder="Email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                className={`w-full mt-6 bg-blue-600 text-white p-2 rounded ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Magic Link"}
              </button>
            </form>

            {message && (
              <p
                className={`mt-4 text-center ${
                  message.startsWith("Check")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUpWithMagicLink;
