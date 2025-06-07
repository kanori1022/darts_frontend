import { ChangeEventHandler } from "react";

type InputProps = {
  children?: React.ReactNode;
  placeholder: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

export const InputShort = (props: InputProps) => {
  const { children, placeholder, onChange } = props;
  return (
    <>
      <p className="text-left">{children}</p>
      <input
        className="border-2 rounded-sm w-70 placeholder-[#A39C9C] border-[#E0E0E0]"
        type="text"
        placeholder={placeholder}
        onChange={onChange}
      ></input>
    </>
  );
};

export const InputLong = (props: InputProps) => {
  const { children, placeholder, onChange } = props;
  return (
    <>
      <p className="text-left">{children}</p>
      <input
        className="border-2 rounded-sm w-full placeholder-[#A39C9C] border-[#E0E0E0]"
        type="text"
        placeholder={placeholder}
        onChange={onChange}
      ></input>
    </>
  );
};
