import React, { useState } from "react";

const Popup = ({ onSubmit, onCancel, children }) => {
  const [nickname, setNickname] = useState("");

  const handleSubmit = () => {
    onSubmit(nickname || null);
    setNickname(""); 
  };

  const handleCancel = () => {
    onCancel();
    setNickname("");
  };

  return (
    <div className="fixed top-0 left-0 flex justify-center items-center w-screen h-screen z-20 bg-opacity-50 bg-slate-900">
      <div className="p-6 min-w-96 min-h-52 flex flex-col justify-evenly items-center bg-slate-900 text-white rounded-md">
        {children}
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Enter a nickname"
          className="py-2 px-4 rounded-md bg-gray-800 text-white outline-none mt-4"
        />
        <div className="flex justify-center space-x-4 mt-4">
          <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Submit
          </button>
          <button onClick={handleCancel} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
