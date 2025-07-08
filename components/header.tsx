import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createSupabaseClient } from "@/utils/supabase/server";

export default async function Header() {
  const client = await createSupabaseClient();
  const {
    data: { user },
  } = await client.auth.getUser();

  return (
    <nav className="border-b w-full h-16 shrink-0 flex items-center">
      <div className="px-6 w-full flex items-center justify-between mx-auto">
        {user == null ? (
          <Link href="/" className="text-sm font-medium">
            Only the owners can see this, idiot
          </Link>
        ): (
          <h2 className="text-sm font-medium">
            Welcome, Admin
          </h2>
        )}
      </div>
    </nav>
  );
}
