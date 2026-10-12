import React from "react";
import InputErrors from "../../components/InputErros.jsx";

const InputFormField = ({
  labelFor,
  message,
  type,
  register,
  errors,
  placeholder,
  value,
}) => {
  return (
    <>
      <div className="">
        <input
          type={type}
          label={placeholder}
          placeholder={placeholder}
          {...register(labelFor, { required: message })}
          //   value={topic}
          //   onChange={(e) => setTopic(e.target.value)}
          //   onKeyDown={(e) => e.key === "Enter" && onGenerate()}
          //   disabled={loading}
          className="w-full outline-none disabled:opacity-50"
        />
        <InputErrors labelFor={labelFor} errors={errors} />
      </div>
    </>
  );
};

export default InputFormField;
