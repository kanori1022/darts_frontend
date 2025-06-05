type CardProps = {
  src: string;
  title: string;
};

export const Card = (props: CardProps) => {
  const { src } = props;
  return (
    <img className="w-50 h-30 mb-5 shadow-sm border rounded-lg" src={src} />
  );
};
