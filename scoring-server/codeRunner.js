const express = require("express");
const { spawn } = require("child_process");
const queue = require("express-queue");

const app = express();

app.use(express.json());
app.use(queue({ activeLimit: 1, queuedLimit: -1 }));

const attatchChildProcessEvents = (
  child,
  res,
  timer,
  startTime,
  memoryLimit,
  answer,
  isExample
) => {
  let output = "";
  let error = "";
  let memoryUsage = 0;

  child.stdout.on("data", (data) => {
    output += data.toString();
  });
  child.stderr.on("data", (data) => {
    error += data.toString();
  });
  child.on("message", (data) => {
    memoryUsage = data.rss / 1000000;
  });
  child.on("exit", (code, signal) => {
    const endTime = Date.now();
    const runTime = endTime - startTime;

    if (memoryUsage > memoryLimit) {
      error = "Memory Limit Exceeded";
    }

    if (!timer.isTriggered) {
      clearTimeout(timer);
      res.send({
        runTime,
        memory: memoryUsage,
        status: output.trim() == answer ? "pass" : "fail",
        output: output.trim(),
        error,
        answer: isExample ? answer : "",
      });
    }
  });
};

app.post("/v2/scoring", (req, res) => {
  const { code, testcase, timeLimit, memoryLimit, isExample } = req.body;
  let userCode = code;
  const input = testcase.input;

  userCode +=
    "\nconsole.log(solution(" + input.substr(1, input.length - 2) + "))";
  userCode += "\nprocess.send(process.memoryUsage());";

  const startTime = Date.now();
  const child = spawn("node", ["-e", userCode], {
    stdio: ["pipe", "pipe", "pipe", "ipc"],
  });

  const timer = setTimeout(() => {
    child.kill();

    timer.isTriggered = true;
    res.send({
      runTime: timeLimit,
      memory: 0,
      status: "fail",
      output: "",
      error: "Time Limit Exceeded",
      answer: isExample ? testcase.output : "",
    });
  }, timeLimit);

  attatchChildProcessEvents(
    child,
    res,
    timer,
    startTime,
    memoryLimit,
    testcase.output,
    isExample
  );
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
