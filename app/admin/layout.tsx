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
      <Image src="/logo.png" alt="logo" width={250} height={150} className="" />
      <div className="flex w-full h-full">
        <ProtectedSidebar />
        <div className="flex-1">
          {children}
        </div>
      </div>
    </Content>
  );
}
