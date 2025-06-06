type CardProps = {
  src: string;
  title: string;
};

export const Card = (props: CardProps) => {
  const { src, title } = props;
  return (
    <div className="px-3 bg-[#DADADA] rounded-lg">
      <div className="w-40 text-[#000000]">{title} </div>
      <img
        className="w-40 h-auto mb-5 shadow-sm border rounded-lg"
        src={src}
        alt={title}
      />
    </div>
  );
};
