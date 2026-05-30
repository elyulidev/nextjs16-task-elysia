"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type TObject, type TString, Type } from "typebox";
import { Compile, type Validator } from "typebox/schema";
import type { FormState } from "@/components/form";
import { parseCookies } from "@/utils/parse-cookie";
import { validator } from "@/utils/validator";

const BASE_URL = "http://127.0.0.1:3000/api";

const userSchema = Type.Object({
  email: Type.String({
    pattern: "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$",
  }),
  password: Type.String({
    minLength: 8,
    maxLength: 12,
  }),
});

const taskSchema = Type.Object({
  title: Type.String(),
  userId: Type.String(),
});

const userValidator = Compile(userSchema);
const taskValidator = Compile(taskSchema);

export type UserValidator = Validator<
  TObject<{ email: TString; password: TString }>,
  { email: string; password: string }
>;
export type TaskValidator = Validator<
  TObject<{ title: TString; userId: TString }>,
  { title: string; userId: string }
>;

const fetchResource = async (
  endpoint: string,
  method: string,
  body?: Record<string, unknown>,
  headers?: Record<string, string>,
) => {
  try {
    console.log(`${BASE_URL}/${endpoint}`);

    const response: Response = await fetch(`${BASE_URL}/${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      ...(body && { body: JSON.stringify(body) }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Error en backend (${response.status}):`, errorText);
      return {
        errors: {
          server: `Error en backend (${response.status}): ${errorText}`,
        },
        data: null,
      };
    }
    // 1. Obtener todas las cookies del backend
    const setCookieHeaders = response.headers.getSetCookie();

    if (setCookieHeaders.length > 0) {
      const cookieStore = await cookies();

      for (const cookieString of setCookieHeaders) {
        const { name, value, cookieOptions } = parseCookies(cookieString);

        // 3. Setear en el cliente
        cookieStore.set(name, value, cookieOptions);
      }
    }

    return response.json();
  } catch (error) {
    console.error("Fallo de conexión total:", error);
    return { errors: { server: "No se pudo conectar con el servidor" } };
  }
};

export const authAction = async (
  previousState: FormState,
  formData: FormData,
) => {
  const email = formData.get("email");
  const password = formData.get("password");
  const endpoint = formData.get("endpoint") as string;
  console.log("endpoint", endpoint);

  const isValid = validator(userValidator, { email, password });

  if (!isValid?.ok) {
    return { ...previousState, errors: isValid?.errors, data: null };
  }

  const result = await fetchResource(endpoint, "POST", {
    email,
    password,
  });

  if (result?.errors) {
    return { ...previousState, errors: result.errors, data: null };
  }

  redirect("/");
};

export const getProfile = async () => {
  //Extraemos las cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return { errors: { server: "Unauthorized" }, data: null };
  }

  // Inyectamos la cookie manualmente en los headers
  const response = await fetchResource("users/me", "GET", undefined, {
    Cookie: `access_token=${token}`,
  });

  if (response.errors) {
    return { errors: response.errors, data: null };
  }

  return response;
};

export const getTasks = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const response = await fetchResource("tasks", "GET", undefined, {
    Cookie: `access_token=${token}`,
  });

  if (response.errors) {
    return { errors: response.errors, data: null };
  }

  return response;
};

export const createTask = async (
  previousState: FormState,
  formData: FormData,
) => {
  const title = formData.get("title");
  const endpoint = formData.get("endpoint") as string;

  const resProfile = await getProfile();

  if (resProfile?.errors) {
    return { ...previousState, errors: resProfile.errors, data: null };
  }

  const task = {
    title,
    userId: resProfile.id,
  };

  const isValid = validator(taskValidator, task);

  if (!isValid?.ok) {
    return { ...previousState, errors: isValid?.errors, data: null };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const response = await fetchResource(endpoint, "POST", task, {
    Cookie: `access_token=${token}`,
  });

  if (response.errors) {
    return { errors: response.errors, data: null };
  }

  revalidatePath("/tasks");
  return response;
};

export const updateTask = async (
  previousState: FormState,
  formData: FormData,
) => {
  const title = formData.get("title") as string;
  const endpoint = formData.get("endpoint") as string;
  const completedStr = formData.get("completed") as string;

  const resProfile = await getProfile();
  if (resProfile?.errors)
    return { ...previousState, errors: resProfile.errors };

  const task = {
    title,
    userId: resProfile.id,
    // Convertimos "true" -> true / "false" -> false
    completed: completedStr === "true",
  };

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const response = await fetchResource(endpoint, "PUT", task, {
    Cookie: `access_token=${token}`,
  });

  if (response.errors) return { ...previousState, errors: response.errors };

  revalidatePath("/tasks");
  redirect("/tasks");
};

export const deleteTask = async (id: string) => {
  const endpoint = `tasks/${id}`;

  // 1. Validar sesión
  const resProfile = await getProfile();
  if (resProfile?.errors) {
    console.log("Error profile", resProfile.errors);
    return;
  }

  // 2. Obtener token
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  // 3. Ejecutar la eliminación en el backend
  // Usamos el método "DELETE"
  const response = await fetchResource(endpoint, "DELETE", undefined, {
    Cookie: `access_token=${token}`,
  });

  if (response.errors) {
    console.log("Error fetch", response.errors);
    return;
  }

  // 4. Actualizar la interfaz
  revalidatePath("/tasks");

  // Si el usuario estaba editando la tarea que acaba de borrar,
  // limpiamos la URL redirigiendo a la base
  redirect("/tasks");
};

export const updateCompletedTask = async (id: string, completed: boolean) => {
  const endpoint = `tasks/${id}`;
  console.log("updatecompletedtask", id, completed);

  // 1. Validar sesión
  const resProfile = await getProfile();
  if (resProfile?.errors) {
    console.error("Error profile:", resProfile.errors);
    return { errors: resProfile.errors };
  }

  // 2. Obtener token
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  // 3. Ejecutar la actualización parcial (PATCH)
  // Enviamos solo el campo 'completed'
  const response = await fetchResource(
    endpoint,
    "PATCH",
    { completed },
    { Cookie: `access_token=${token}` },
  );

  if (response.errors) {
    console.error("Error al actualizar estado:", response.errors);
    return { errors: response.errors };
  }

  // 4. Actualizar la interfaz sin recargar la página completa
  revalidatePath("/tasks");

  // Nota: No usamos redirect("/tasks") aquí porque si el usuario marca el checkbox,
  // no queremos que se le limpie el formulario de edición si es que estaba editando otra cosa.
  return { success: true };
};

export const logout = async () => {
  // 1. Validar sesión
  const resProfile = await getProfile();
  if (resProfile?.errors) {
    console.log("Error profile", resProfile.errors);
    return;
  }

  // 2. Obtener token
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
  redirect("/login");
};
