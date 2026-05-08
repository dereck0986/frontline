/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const createServerClient = () =>
  createServerComponentClient<any>({ cookies });
