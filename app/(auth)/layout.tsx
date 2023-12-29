import Image from "next/image";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col-reverse md:flex-row ">
      <section className="md:w-1/2  bg-rls   w-full hidden md:block ">
        <div className="flex justify-center items-center h-screen flex-col space-y-20">
          <span className="font-extrabold text-white text-3xl w-3/4 text-center">
            Rocket League Scout
          </span>
        </div>
      </section>
      <section className="md:w-1/2  p-8 w-full ">{children}</section>
    </div>
  );
}
