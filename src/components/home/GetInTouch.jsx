import React from "react";

const GetInTouch = ({ heading, message }) => {
  return (
    <>
      <h3 className="display-4 pb-3 text-center">{heading}</h3>
      <p className="lead text-center pb-3">
        {message.split('\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </p>
    </>
  );
};

export default GetInTouch;
