import React from "react";

function ValidationError({ error }) {
  return (
    <div className="min-h-[18px] w-[70%]">
      {error ? (
        <p className="text-xs text-red-500 mt-1">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default ValidationError;