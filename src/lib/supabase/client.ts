/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const createClient = () => createClientComponentClient<any>();
