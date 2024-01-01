import Navbar from "@/components/navbar";
import UserProvider from "@/providers/UserProvider";
// export const revalidate = 0;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <div className="h-screen flex flex-col">
        <Navbar />
        <div className="flex  h-full overflow-auto">
          <div className="h-full w-full bg-[#f5f8fb] p-6 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </UserProvider>
  );
}
