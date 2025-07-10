import InPageSidebar from "@/components/in-page-sidebar";

export default async function ProtectedSidebar() {

  return (
    <InPageSidebar
      basePath="/admin"
      items={[
        {
          label: "Account",
          href: "/",
        },
        {
          label: 'My Cards',
          href: '/cards'
        },
        {
          label: "Direct Payment",
          href: "/direct-payment",
        },
        {
          label: "Subscription",
          href: "/subscription",
        },
        {
          label: "Paid Content",
          href: "/paid-content",
        },
      ]}
    />
  );
}
