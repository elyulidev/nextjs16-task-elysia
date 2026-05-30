import { redirect } from "next/navigation";
import { createTask, getProfile, getTasks, updateTask } from "@/actions";
import CheckboxList from "@/components/checkbox-list";
import Form from "@/components/form";

export type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export type Tasks = Array<Task>;

const TasksPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const profile = await getProfile();

  if (profile?.errors?.server) {
    redirect("/login");
  } else if (profile?.role !== "ADMIN") {
    redirect("/");
  }

  let tasks: Tasks = [];

  const result = await getTasks();
  if (!result?.errors) {
    tasks = [...result];
  }

  const task = await searchParams;

  let action = createTask;
  let textButton = "Criar";
  let inputs = [
    { id: 1, label: "", type: "text", name: "title" },
    { id: 2, label: "", type: "hidden", name: "endpoint", value: "tasks" },
  ];

  if (task?.id && task?.title && task?.completed) {
    action = updateTask;
    textButton = "Editar";
    inputs = [
      {
        id: 1,
        label: "",
        type: "text",
        name: "title",
        value: task.title as string,
      },
      {
        id: 2,
        label: "",
        type: "hidden",
        name: "endpoint",
        value: `tasks/${task.id}`,
      },
      {
        id: 3,
        label: "",
        type: "hidden",
        name: "completed",
        value: task.completed.toString(),
      },
    ];
  }

  const formKey = Array.isArray(task?.id) ? task.id[0] : task?.id;

  return (
    <main className="flex flex-col gap-16">
      <section>
        <Form
          key={formKey || "create"}
          textButton={textButton}
          action={action}
          inputs={inputs}
          className={{
            form: "flex items-start gap-2 mt-10 w-full",
            label: "grow",
            input: "mt-1 p-2 border border-gray-300 rounded w-full",
            btn: "mt-1 p-2 border border-gray-300 rounded w-fit h-10 cursor-pointer hover:bg-gray-100 transition-colors duration-200 bg-blue-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500",
          }}
        />
      </section>
      <section>
        <CheckboxList lista={tasks} />
      </section>
    </main>
  );
};

export default TasksPage;
