"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getBusinessByUserId, updateBusiness } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  id: z.string().min(1),
  name: z.string().min(2),
  industry: z.string().min(1),
  location: z.string().min(2),
  tone: z.enum(["professional", "friendly", "apologetic", "bold"]),
});

export type SettingsState = { error?: string; success?: boolean };

export async function updateBusinessAction(
  _prev: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session?.user) return { error: "Unauthorized" };

  const parsed = schema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    industry: formData.get("industry"),
    location: formData.get("location"),
    tone: formData.get("tone"),
  });

  if (!parsed.success) {
    return { error: "Invalid form data" };
  }

  const existing = await getBusinessByUserId(session.user.id);
  if (!existing || existing.id !== parsed.data.id) {
    return { error: "Business not found" };
  }

  await updateBusiness(parsed.data.id, {
    name: parsed.data.name,
    industry: parsed.data.industry,
    location: parsed.data.location,
    tone: parsed.data.tone,
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}
