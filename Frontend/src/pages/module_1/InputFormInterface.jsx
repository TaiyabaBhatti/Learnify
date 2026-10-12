import React from "react";
import { GRADE_LEVELS } from "../../utils/constants";
import ActionButton from "../../components/ActionButton";
import Button from "../../components/Button";
import GradeLevelBlock from "./GradeLevelBlock";
import InputFormField from "./InputFormField.jsx";
import { useForm } from "react-hook-form";
import InputErrors from "../../components/InputErros.jsx";
import { generateScript } from "../../api/scriptApi.js";
import { getErrorMessage } from "../../utils/getErrorMessage.js";
import { useLessonJob } from "../../hooks/useLessonJob.js";

const InputFormInterface = ({
  setScript,
  setLoading,
  setErrorMessage,
  job,
  busy,
}) => {
  const {
    handleSubmit,
    register,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const handleGenerate = async (data) => {
    console.log(data);
    job.start({ topic: data.topic, grade_level: data.grade });
    // debugging user form data
    // try {
    //   const response = await generateScript(data);
    //   setScript(response.data.script);

    //   // print coming response
    //   console.log(response.data.script);
    // } catch (error) {
    //   console.log("Error: ", error);
    //   setErrorMessage(getErrorMessage(error));
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <form
      onSubmit={handleSubmit(handleGenerate)}
      className="flex flex-col justify-between h-full"
    >
      <fieldset
        disabled={busy}
        className={`flex h-full flex-col justify-between transition-opacity ${
          busy ? "opacity-60 pointer-events-none cursor-not-allowed" : ""
        }`}
      >
        <InputFormField
          labelFor={"topic"}
          message={"Topic is required"}
          type={"text"}
          placeholder={"For Example: How does rain form?"}
          register={register}
          errors={errors}
        />

        <div className="flex justify-between">
          <GradeLevelBlock
            register={register}
            setValue={setValue}
            errors={errors}
            watch={watch}
            labelFor={"grade_level"}
          />

          <ActionButton btnText={busy ? "Generating..." : "Generate lesson"} />
        </div>
      </fieldset>
    </form>
  );
};

export default InputFormInterface;
