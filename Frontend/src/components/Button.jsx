import React from 'react';

const Button = ({properties,labelText,ageText}) => {
    return (
    <button
      className={`cursor-pointer rounded-xl ${properties}  text-sm font-medium  transition-all`}
    >
         <div className="font-medium">{labelText}</div>
              <div className="text-xs opacity-70">{ageText}</div>
    </button>
  );
}

export default Button;
