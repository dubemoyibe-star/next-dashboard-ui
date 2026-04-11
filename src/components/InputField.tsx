import React, { useState } from "react";
import { FieldError } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

type inputPropsType = {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError;
  hidden?: boolean
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  textarea?: boolean
};

const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  hidden,
  inputProps,
  textarea
}: inputPropsType) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className={hidden ? "hidden" : "relative flex flex-col gap-2 w-full md:w-1/4" }>
      <label className="text-xs text-gray-500" htmlFor={name}>{label}</label>

      <div className="relative w-full">
       {textarea ? (
          <textarea
            id={name}
            {...register(name)}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={defaultValue}
            {...inputProps}
          />
        ) : (
          <input
            id={name}
            type={isPassword ? (showPassword ? "text" : "password") : type}
            {...register(name)}
            className="ring-[1.5px] ring-gray-300 p-2 pr-10 rounded-md text-sm w-full"
            defaultValue={defaultValue}
            {...inputProps}
          />
        )}

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff className="w-4 h-4 text-gray-300"/> : <Eye className="w-4 h-4 text-gray-300"/>}
          </button>
        )}
      </div>

      {error?.message && (
        <p className="text-xs text-red-400">
          {error.message.toString()}
        </p>
      )}
    </div>
  );
};

export default InputField;