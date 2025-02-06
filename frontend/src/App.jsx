import React from "react";

import Table from "./components/Table";

function App() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-0 mt-0 py-2 bg-orange-100">
        Transaction Dashboard
      </h1>

      <Table />
    </div>
  );
}

export default App;
