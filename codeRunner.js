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
  answer
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
        output: output.trim() == answer ? "Accepted" : "Wrong Answer",
        error,
      });
    }
  });
};

app.post("/v2/scoring", (req, res) => {
  const { code, testcase, timeLimit, memoryLimit } = req.body;
  let userCode = code;

  console.log(testcase);

  userCode += `\nconsole.log(solution(${testcase.input.join(", ")}));`;
  userCode += `\nprocess.send(process.memoryUsage());`;

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
      output: "",
      error: "Time Limit Exceeded",
    });
  }, timeLimit);

  attatchChildProcessEvents(
    child,
    res,
    timer,
    startTime,
    memoryLimit,
    testcase.output
  );
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
