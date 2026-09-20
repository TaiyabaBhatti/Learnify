import React, { use, useState } from "react";
import Wrapper from "../components/Wrapper.jsx";
import InputFormInterface from "./module_1/InputFormInterface.jsx";
import ScriptViewer from "./module_2/ScriptViewer.jsx";
import ErrorMessage from "../components/messages/ErrorMessage.jsx";

const Home = () => {
  // ui states for showing
  const [errorMessage, setErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successStatus, setSuccessStatus] = useState(false);

  // data set state
  const [script, setScript] = useState(null);
  return (
    <>
      <Wrapper>
        <section>
          <InputFormInterface
            setScript={setScript}
            setErrorMessage={setErrorMessage}
            setLoading={setLoading}
          />
          {loading && (
            <div className="mt-4  text-blue-600 animate-pulse">
              Analyzing topic...
            </div>
          )}
          {errorMessage && <ErrorMessage text={errorMessage} />}
          {!loading && !errorMessage && <ScriptViewer script={script} />}
        </section>
      </Wrapper>
    </>
  );
};

export default Home;
