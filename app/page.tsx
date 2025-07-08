import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-start justify-center px-4 py-0">
      <div className="mx-auto max-w-xl flex flex-col">
        <div className="flex gap-4 justify-center w-full items-center">
          <Image src="/logo.png" alt="logo" width={520} height={520} />
        </div>
        <div className="flex gap-[8px] mt-0 justify-center w-full items-center">
          <Button asChild className="mt-0 w-fit" size="lg" variant={"default"}>
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </div>
        </div>
      </div>
  );
}
