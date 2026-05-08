"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
});

type FormData = z.infer<typeof schema>;

export function SignupForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError(null);

    // Register the user
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.full_name,
        email: data.email,
        password: data.password,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      setServerError(body.error ?? "Something went wrong");
      return;
    }

    // Auto sign in after registration
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setServerError("Account created but sign in failed. Please log in.");
      return;
    }

    router.push("/onboarding");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="full_name"
        type="text"
        label="Full Name"
        placeholder="Jane Smith"
        autoComplete="name"
        error={errors.full_name?.message}
        {...register("full_name")}
      />

      <Input
        id="email"
        type="email"
        label="Work Email"
        placeholder="you@company.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        id="password"
        type="password"
        label="Password"
        placeholder="••••••••"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />

      {serverError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {serverError}
        </p>
      )}

      <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
        Create account
      </Button>

      <p className="text-xs text-center text-gray-500">
        By signing up you agree to our{" "}
        <a href="#" className="text-brand-600 hover:underline">
          Terms
        </a>{" "}
        and{" "}
        <a href="#" className="text-brand-600 hover:underline">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
}
