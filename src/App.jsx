import { useState, version } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex min-h-screen flex-col justify-center gap-4 text-center align-middle">
      <h1 className="text-app-main text-3xl font-bold">
        {import.meta.env.VITE_APP_NAME}
      </h1>
      <p>React {version}</p>
      <div className="card">
        <button
          className="bg-app-main rounded-xl p-4 font-semibold text-white"
          onClick={() => setCount((count) => count + 1)}
        >
          count is <span className="font-bold">{count}</span>
        </button>
      </div>
    </div>
  );
}

export default App;
