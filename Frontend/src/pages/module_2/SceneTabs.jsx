import React from "react";

const SceneTabs = ({ scenesTab, setActiveScene, activeScene }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {scenesTab?.map((scene, index) => (
        <button
          key={index}
          onClick={() => setActiveScene(index)}
          className={`cursor-pointer  whitespace-nowrap  ${
            activeScene === index
              ? "bg-blue-600 text-white "
              : "bg-white text-gray-500 "
          }`}
        >
          {scene.emoji} Scene {scene.scene_number}
        </button>
      ))}
    </div>
  );
};

export default SceneTabs;
