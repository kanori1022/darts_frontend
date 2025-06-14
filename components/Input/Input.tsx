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
      {/* <div className="relative w-70 mb-8 group"> */}
      <input
        className="border-2 rounded-sm w-70 placeholder-[#A39C9C] border-[#E0E0E0]"
        type="text"
        placeholder={placeholder}
        onChange={onChange}
      ></input>

      {/* {/* <div class="relative z-0 w-full mb-5 group"> */}
      {/* <input
          className="block pl-1 w-70 text-gray-900 
          bg-transparent border-2 rounded-sm
          border-[#E0E0E0] appearance-none 
          dark:text-[#000000] dark:border-gray-600 
          dark:focus:border-blue-500 focus:outline-none 
          focus:ring-0 focus:border-blue-600 peer"
          type="text"
          placeholder=" "
          onChange={onChange}
          name="floating_last_name"
          id="floating_last_name"
        ></input> */}

      {/* <label
          htmlFor="floating_last_name"
          // className="peer-focus:font-medium absolute text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-0 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          className="peer-focus:font-medium absolute text-gray-500 dark:text-gray-400 duration-300 -translate-y-6 scale-75 top-0 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          {placeholder}
        </label>
      </div> */}
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
