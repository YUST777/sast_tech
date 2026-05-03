import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import LoginScreen from "@/components/ui/login-1";

export default async function RegisterPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/download");
  }

  return <LoginScreen />;
}
