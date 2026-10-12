import React, { useState } from "react";
import MainHeader from "../MainHeader.jsx";
import SystemPromptBlock from "./SystemPromptBlock.jsx";
import ErrorMessage from "../../../components/messages/ErrorMessage.jsx";
import LessonGenerator from "../../../components/LessonGenerator.jsx";
import { useLessonJob } from "../../../hooks/useLessonJob.js";
import InputFormInterface from "../../module_1/InputFormInterface.jsx";
import ProgressPanel from "../../../components/ProgressPanel.jsx";

const Dashboard = () => {
  // ui states for showing
  const job = useLessonJob();
  const busy = job.phase === "running";
  const [errorMessage, setErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successStatus, setSuccessStatus] = useState(false);

  // data set state
  const [script, setScript] = useState(null);

  return (
    <>
      <section className="pt-28 flex flex-col items-center justify-center">
        <div>
          <MainHeader />
          <div className="my-10 rounded-2xl h-44 bg-white p-6 w-3xl">
            <InputFormInterface
              setScript={setScript}
              setErrorMessage={setErrorMessage}
              job={job}
              busy={busy}
              setLoading={setLoading}
            />
          </div>
        </div>

        {job.phase !== "idle" && <ProgressPanel {...job} />}
        {/* {loading && (
          <div className="mt-4  text-blue-600 animate-pulse">
            Analyzing topic...
          </div>
        )}
        {errorMessage && <ErrorMessage text={errorMessage} />} */}
      </section>
    </>
  );
};

export default Dashboard;
