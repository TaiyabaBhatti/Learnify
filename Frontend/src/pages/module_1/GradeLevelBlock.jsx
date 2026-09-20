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
      <label className="block text-xs">Grade Level</label>
      <div className="flex gap-3">
        {GRADE_LEVELS.map((grade) => (
          <button
            type="button"
            onClick={() => setValue("grade_level", grade.value)}
            key={grade.value}
            className={`${
              selectedGrade === grade.value
                ? "bg-blue-100 text-blue-700"
                : " bg-white text-gray-700"
            } cursor-pointer `}
          >
            <div className="">{grade.label}</div>
            <div className="">{grade.age}</div>
          </button>
        ))}
      </div>
      <InputErrors labelFor={labelFor} errors={errors} />
    </div>
  );
};

export default GradeLevelBlock;
