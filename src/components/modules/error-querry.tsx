import React from "react";

const ErrorQuerry = ({ errorQuerry }: { errorQuerry: string }) => {
  return <div className="text-red-500">{errorQuerry}</div>;
};

export default ErrorQuerry;
