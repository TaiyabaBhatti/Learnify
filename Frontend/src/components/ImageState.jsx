import React, { useEffect, useState } from "react";

const ImageState = ({ src, alt, onLoad, onError, properties }) => {
  return (
    <img
      src={src}
      alt={alt}
      onLoad={onload}
      className={`h-36 object-cover w-36 rounded-lg`}
      onError={onError}
    />
  );
};

export default ImageState;
