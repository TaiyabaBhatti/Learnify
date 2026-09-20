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

const InputFormInterface = ({ setScript, setLoading, setErrorMessage }) => {
  const {
    handleSubmit,
    register,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const handleGenerate = async (data) => {
    // debugging user form data
    console.log(data);
    setLoading(true);
    try {
      const response = await generateScript(data);
      setScript(response.data.script);

      // print coming response
      console.log(response.data.script);
    } catch (error) {
      console.log("Error: ", error);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white p-6 w-3xl">
      <form onSubmit={handleSubmit(handleGenerate)} className="space-y-3">
        <InputFormField
          labelFor={"topic"}
          message={"Topic is required"}
          type={"text"}
          placeholder={"How does rain form?"}
          register={register}
          errors={errors}
        />

        <GradeLevelBlock
          register={register}
          setValue={setValue}
          errors={errors}
          watch={watch}
          labelFor={"grade_level"}
        />

        <ActionButton btnText={"Generate Lesson"} />
      </form>
    </section>
  );
};

export default InputFormInterface;
