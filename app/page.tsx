import { test } from "@/api/auth/auth.api";

export default async function Home() {

  const rer = await test();

  console.log("dmasndkasd", rer);


  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="text-2xl font-semibold">
        Job Platform Frontend Ready 🚀
      </h1>
    </div>
  );
}