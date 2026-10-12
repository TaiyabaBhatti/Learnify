import React, { use, useState } from "react";
import InputFormInterface from "../../module_1/InputFormInterface";

const SystemPromptBlock = () => {
  // ui states for showing
  const [errorMessage, setErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successStatus, setSuccessStatus] = useState(false);

  // data set state
  const [script, setScript] = useState(null);
  return (
    <div className="my-10">
      <div className="rounded-2xl bg-white w-3xl h-44">
        <InputFormInterface
          setScript={setScript}
          setErrorMessage={setErrorMessage}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
};

export default SystemPromptBlock;
