export default function Content({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-screen-lg py-0 px-2 w-full flex flex-col items-center justify-between mx-auto">
      {children}
    </div>
  );
}
