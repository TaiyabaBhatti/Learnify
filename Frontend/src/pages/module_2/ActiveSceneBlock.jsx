import React from "react";

const ActiveSceneBlock = ({ scene, script, setActiveScene, activeScene }) => {
  return (
    <div className="bg-white  p-5">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{scene?.emoji}</span>
        <div>
          <p className="text-xs text-gray-400">
            Scene {scene?.scene_number} of {script?.scenes.length}
          </p>
          <h3 className="text-base text-gray-800">{scene?.title}</h3>
        </div>
      </div>

      {/* narration */}
      <div className="bg-gray-50">
        <p className="text-xs">Narration</p>
        <p className="text-sm text-gray-700 ">{scene?.narration}</p>
      </div>

      {/* key concept and whiteboard visuals */}
      <div className="">
        <div className="text-xs">
          <p className="">Key Concept</p>
          <p className=" ">{scene?.key_concept}</p>
        </div>
        <div className="text-xs">
          <p className="">Whiteboard Visual</p>
          <p className=" ">{scene?.visual_hint}</p>
        </div>
      </div>

      {/* <div className="flex justify-between mt-4">
            <button
              onClick={() => setActiveScene((p) => Math.max(0, p - 1))}
              disabled={activeScene === 0}
              className="text-sm text-gray-400 hover:text-gray-600 disabled:opacity-30"
            >
              ← Previous
            </button>
            <button
              onClick={() =>
                setActiveScene((p) => Math.min(script.scenes.length - 1, p + 1))
              }
              disabled={activeScene === script.scenes.length - 1}
              className="text-sm text-gray-400 hover:text-gray-600 disabled:opacity-30"
            >
              Next →
            </button>
          </div> */}
    </div>
  );
};

export default ActiveSceneBlock;
