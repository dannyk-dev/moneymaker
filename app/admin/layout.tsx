import Content from "@/components/content";
import ProtectedSidebar from "@/components/protected-sidebar";
import Image from "next/image";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Content>
      <Image src="/logo.png" alt="logo" width={120} height={120} className=" mr-auto" />
      <div className="flex w-full h-full">
        <ProtectedSidebar />
        <div className="flex-1">
          {children}
        </div>
      </div>
    </Content>
  );
}
