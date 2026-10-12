import React, { use, useState } from "react";
import InputFormInterface from "../../module_1/InputFormInterface";

const SystemPromptBlock = ({ setScript, setLoading, setErrorMessage }) => {
  return (
    <div className="my-10 rounded-2xl h-44 bg-white p-6 w-3xl ">
      <InputFormInterface
        setScript={setScript}
        setErrorMessage={setErrorMessage}
        setLoading={setLoading}
      />
    </div>
  );
};

export default SystemPromptBlock;
