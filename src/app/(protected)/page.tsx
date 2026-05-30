import { redirect } from "next/navigation";
import { getProfile } from "@/actions";

export default async function Home() {
  const profile = await getProfile();

  if (profile?.errors?.server) {
    redirect("/login");
  }
  return (
    <main className="w-full md:max-w-3xl mx-auto mt-10">
      <h1 className="text-blue-400 font-semibold">Olá, {profile?.email}</h1>
      <h2 className="text-gray-300">Role: {profile?.role?.toLowerCase()}</h2>
    </main>
  );
}
