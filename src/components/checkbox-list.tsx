import type { Tasks } from "@/app/(protected)/tasks/page";
import Checkbox from "./checkbox";

type CheckboxListProps = {
  lista: Tasks;
};
const CheckboxList = ({ lista }: CheckboxListProps) => {
  return (
    <section>
      {lista.length > 0 ? (
        lista.map((c) => <Checkbox key={c.id} {...c} />)
      ) : (
        <p className="text-center text-2xl">No tem tarefas</p>
      )}
    </section>
  );
};

export default CheckboxList;
