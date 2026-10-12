import React from "react";
import { GRADE_LEVELS } from "../../utils/constants";
import Button from "../../components/Button";
import InputErrors from "../../components/InputErros.jsx";

const GradeLevelBlock = ({ setValue, watch, labelFor, errors, register }) => {
  const selectedGrade = watch(labelFor);

  return (
    <div className="">
      <input
        type="hidden"
        {...register(labelFor, {
          required: "Please select a grade level",
        })}
      />

      <div className="flex gap-3">
        {GRADE_LEVELS.map((grade) => (
          <button
            type="button"
            onClick={() => setValue("grade_level", grade.value)}
            key={grade.value}
            className={`px-5 py-2 text-xs font-semibold rounded-2xl${
              selectedGrade === grade.value
                ? " bg-light-mint text-white"
                : " bg-opacity-blue-2 "
            } cursor-pointer `}
          >
            <div className="">Grade {grade.label}</div>
            <div className="">{grade.age} </div>
          </button>
        ))}
      </div>
      <InputErrors labelFor={labelFor} errors={errors} />
    </div>
  );
};

export default GradeLevelBlock;
