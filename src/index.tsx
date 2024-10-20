import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/unpkg=path-plugins";

const App = () => {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  const ref = useRef<any>();

  const onClick = async () => {
    if (!ref.current) return;
    // console.log(ref.current);

    // const result = await ref.current.transform(input, {
    //     loader:"jsx",
    //     target:"es2015"
    // })

    const result = await ref.current.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin()],
    });
    // console.log(result);
    setCode(result.outputFiles[0].text);
  };

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: "/esbuild.wasm",
    });
    // console.log(service);
  };

  useEffect(() => {
    startService();
  }, []);

  return (
    <div>
      <textarea
        name=""
        id=""
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
