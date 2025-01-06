"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      router.replace("/jobs");
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setEmailError("");
    setPasswordError("");
    const formData = new FormData(e.currentTarget);

    if (isLogin) {
      try {
        const result = await signIn("credentials", {
          email: formData.get("email"),
          password: formData.get("password"),
          redirect: false,
        });

        if (result?.error) {
          if (result.error.includes("No account found")) {
            setEmailError(result.error);
          } else if (result.error.includes("Incorrect password")) {
            setPasswordError(result.error);
          } else {
            setError(result.error);
          }
        } else if (result?.ok) {
          router.replace("/jobs");
        }
      } catch (error) {
        console.error("Login error:", error);
        setError("An error occurred during login");
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            email: formData.get("signupEmail"),
            password: formData.get("signupPassword"),
          }),
        });

        if (res.ok) {
          const result = await signIn("credentials", {
            email: formData.get("signupEmail"),
            password: formData.get("signupPassword"),
            redirect: false,
          });

          if (result?.error) {
            setError(result.error);
          } else if (result?.ok) {
            router.replace("/jobs");
          }
        } else {
          const data = await res.json();
          setError(data.message || "Registration failed");
        }
      } catch (error) {
        setError("An error occurred");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError("");
    setEmailError("");
    setPasswordError("");
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-white dark:bg-zinc-900">
      <div
        className={`bg-white dark:bg-zinc-800 p-8 rounded-lg shadow-lg transition-all duration-300 ease-in-out ${
          isLogin ? "w-96" : "w-96 h-auto"
        }`}
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center">
          {isLogin ? "Login" : "Signup"}
        </h2>
        {error && (
          <div className="mb-4 text-red-500 text-sm text-center">{error}</div>
        )}
        <form
          onSubmit={handleSubmit}
          className={`transition-all duration-300 ease-in-out ${
            isLogin ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
          }`}
        >
          {/* Login Form */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              disabled={isLoading}
              className={`w-full px-3 py-2 border ${
                emailError ? 'border-red-500' : 'border-zinc-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50`}
            />
            {emailError && (
              <p className="mt-1 text-sm text-red-500">{emailError}</p>
            )}
          </div>
          <div className="mb-2">
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              disabled={isLoading}
              className={`w-full px-3 py-2 border ${
                passwordError ? 'border-red-500' : 'border-zinc-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50`}
            />
            {passwordError && (
              <p className="mt-1 text-sm text-red-500">{passwordError}</p>
            )}
          </div>
          <div className="flex items-center justify-end mb-4">
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Loading...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <form
          onSubmit={handleSubmit}
          className={`transition-all duration-300 ease-in-out ${
            isLogin ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
          }`}
        >
          {/* Signup Form */}
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm font-medium mb-1">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-sm font-medium mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="signupEmail" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="signupEmail"
              name="signupEmail"
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="signupPassword" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="signupPassword"
              name="signupPassword"
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Loading...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="text-center my-2 text-sm text-zinc-500">or</div>
        <button
          onClick={toggleForm}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {isLogin ? "Signup" : "Login"}
        </button>
      </div>
    </main>
  );
}