"use client";

import { Edit, Trash } from "lucide-react";
import Link from "next/link";
import { deleteTask, updateCompletedTask } from "@/actions";

const Checkbox = ({
  id,
  title,
  completed,
}: {
  id: string;
  title: string;
  completed: boolean;
}) => {
  return (
    <div className="px-2 shadow-sm dark:shadow-white/50 flex items-center justify-between">
      <label className="p-4   flex items-center gap-2 text-2xl">
        <input
          type="checkbox"
          checked={completed}
          className={`size-10`}
          onChange={({ target }) => updateCompletedTask(id, target.checked)}
        />
        {title}
      </label>
      <div className="flex gap-4">
        <Link href={`tasks?id=${id}&&title=${title}&&completed=${completed}`}>
          <Edit className="text-blue-400" size={30} />
        </Link>
        <button
          type="button"
          onClick={() => deleteTask(id)}
          className="text-red-400"
        >
          <Trash size={30} />
        </button>
      </div>
    </div>
  );
};

export default Checkbox;
