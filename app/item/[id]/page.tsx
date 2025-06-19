"use client";

type Props = {
  params: { id: string };
};

export default function Item(props: Props) {
  const { id } = props.params;
  // const { data } = useFetch<Combination[]>("/combinations");
  console.log("params.idはーーーーーーーーーーー", id);
  return (
    <div>
      <div className="p-3 font-bold bg-white">IDは{id}です！</div>
      <div className="p-3 font-bold bg-white">localhost:3000/item/{id}</div>
    </div>
  );
}

// http://localhost:3000/item/2
