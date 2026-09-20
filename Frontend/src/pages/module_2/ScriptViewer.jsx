import React, { useState } from "react";
import HighlightBlock from "./HighlightBlock.jsx";
import SceneTabs from "./SceneTabs.jsx";
import FollowupQuestions from "./FollowupQuestions.jsx";
import ActiveSceneBlock from "./ActiveSceneBlock.jsx";

const ScriptViewer = ({ script }) => {
  const [activeScene, setActiveScene] = useState(0);
  const scene = script?.scenes[activeScene];

  return (
    <section className="bg-white mt-6 space-y-4 w-3xl">
      {/* {script} */}

      {/* Learning objective */}
      <HighlightBlock objective={script?.learning_objective} />
      {/* Scene tabs */}
      <SceneTabs
        scenesTab={script?.scenes}
        setActiveScene={setActiveScene}
        activeScene={activeScene}
      />
      {/* Active scene */}
      <ActiveSceneBlock
        scene={scene}
        script={script}
        setActiveScene={setActiveScene}
        activeScene={activeScene}
      />
      {/* Follow-up questions */}
      <FollowupQuestions followupQuestions={script?.follow_up_questions} />
    </section>
  );
};

export default ScriptViewer;
