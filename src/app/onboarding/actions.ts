"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createBusiness, getBusinessByUserId } from "@/lib/db";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  industry: z.string().min(1),
  location: z.string().min(2),
  tone: z.enum(["professional", "friendly", "apologetic", "bold"]),
});

export async function createBusinessAction(formData: FormData): Promise<void> {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const parsed = schema.safeParse({
    name: formData.get("name"),
    industry: formData.get("industry"),
    location: formData.get("location"),
    tone: formData.get("tone"),
  });

  if (!parsed.success) redirect("/onboarding?error=invalid");

  const existing = await getBusinessByUserId(session.user.id);
  if (existing) redirect("/dashboard");

  await createBusiness({
    userId: session.user.id,
    ...parsed.data!,
  });

  redirect("/dashboard");
}
