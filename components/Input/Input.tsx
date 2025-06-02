type InputProps = {
  children?: React.ReactNode;
  placeholder: string;
};

export const InputShort = (props: InputProps) => {
  return (
    <>
      <p className="text-left">{props.children}</p>
      <input
        className="border-2 rounded-sm w-70 placeholder-[#A39C9C] border-[#E0E0E0]"
        type="text"
        placeholder={`${props.placeholder}`}
      ></input>
    </>
  );
};

export const InputLong = (props: InputProps) => {
  return (
    <>
      <p className="text-left">{props.children}</p>
      <input
        className="border-2 rounded-sm w-full placeholder-[#A39C9C] border-[#E0E0E0]"
        type="text"
        placeholder={`${props.placeholder}`}
      ></input>
    </>
  );
};
