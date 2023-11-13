const express = require("express");
const spawn = require("child_process").spawn;
const fs = require("fs");

const app = express();

app.use(express.json());

const attatchChildProcessEvents = (child, res, timer, startTime) => {
  let output = "";
  let error = "";

  child.stdout.on("data", (data) => {
    output += data.toString();
  });
  child.stderr.on("data", (data) => {
    error += data.toString();
  });
  child.on("exit", (code, signal) => {
    const endTime = Date.now();
    const runTime = endTime - startTime;

    clearTimeout(timer);
    res.send({
      runTime,
      memory: "not implemented",
      output,
      error,
    });
  });
};

app.post("/v2/scoring", (req, res) => {
  const { code, testcase } = req.body;
  let userCode = code;
  userCode += `\nconsole.log(solution(${testcase.parameters.join(", ")}));`;

  fs.writeFileSync("userCode.js", userCode);

  // delete cashe
  delete require.cache[require.resolve("./userCode")];
  const startTime = Date.now();
  const child = spawn("node", ["./userCode.js"]);

  const timer = setTimeout(() => {
    child.kill();
    res.send({
      runTime: 2000,
      memory: 0,
      output: "",
      error: "Time Limit Exceeded",
    });
  }, 2000);

  attatchChildProcessEvents(child, res, timer, startTime);
});

app.listen(3001, () => {
  console.log("Server is listening on port 3000");
});
