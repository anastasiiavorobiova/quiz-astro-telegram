import { useState } from "react";

export function Hello() {
  const [count, setCount] = useState(0);

  return (
    <div>
      Hello, {count} times
      <button type="button" onClick={() => setCount(count + 1)}>
        +
      </button>
    </div>
  );
}

export default Hello;
