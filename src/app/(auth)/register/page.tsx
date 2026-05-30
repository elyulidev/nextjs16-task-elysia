import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authAction } from "@/actions";
import Card from "@/components/card";
import Form from "@/components/form";

const RegisterPage = async () => {
  const cookieStore = await cookies();
  if (cookieStore.get("access_token")) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen w-full justify-center items-center p-2">
      <Card title="Crear Cuenta" subtitle="Ingresa tus datos">
        <Form
          textButton="Registrarse"
          action={authAction}
          inputs={[
            { id: 1, label: "Correo Eletronico", type: "email", name: "email" },
            { id: 2, label: "Contrasenha", type: "password", name: "password" },
            {
              id: 3,
              label: "",
              type: "hidden",
              name: "endpoint",
              value: "auth/sign-up",
            },
          ]}
          className={{
            form: "",
            label: "block mb-2",
            input: "mt-1 p-2 border border-gray-300 rounded w-full",
            btn: "mt-1 p-2 border border-gray-300 rounded w-full h-10 cursor-pointer hover:bg-gray-100 transition-colors duration-200 bg-blue-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500",
          }}
        />
      </Card>
    </main>
  );
};

export default RegisterPage;
