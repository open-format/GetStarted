import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  email: string;
  key: string;
};

type User = {
  id: string;
  createdAt: string;
  email: string;
  wallet_address: string;
};

export const SignUpWithMagicLink: React.FC = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

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
      setMessageType("success");
      reset();
    } else {
      const errorData = await response.json();
      setMessage(errorData.error);
      setMessageType("error");
    }
    setLoading(false);
  }

  return (
    <div className="w-full flex flex-col justify-center ">
      <div className="relative py-3 sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 sm:p-10">
          {message && (
            <p
              className={`mt-4 text-center ${
                messageType === "success" ? "text-green-500" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}

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
              className={`w-full mt-6 bg-gray-100 text-gray-900 font-bold opacity-80 p-2 hover:bg-gray-200 transition-all duration-3000 rounded-lg ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Magic Link"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpWithMagicLink;
