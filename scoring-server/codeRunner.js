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
  testcase,
  isExample
) => {
  let output = "";
  let error = "";
  let childMessages = [];

  child.stdout.on("data", (data) => {
    output += data.toString();
  });
  child.stderr.on("data", (data) => {
    error += data.toString();
  });
  child.on("message", (data) => {
    childMessages.push(data);
  });
  child.on("exit", (code, signal) => {
    const endTime = Date.now();
    const runTime = endTime - startTime;

    let memoryUsage = 0;
    let status = "fail";
    if (childMessages.length == 2) {
      memoryUsage = childMessages[1].rss / 1000000;
      status =
        childMessages[0].toString().trim() == testcase.output ? "pass" : "fail";
    } else {
      memoryUsage = 0;
      status = "fail";
    }

    if (memoryUsage > memoryLimit) {
      error = "Memory Limit Exceeded";
    }

    if (!timer.isTriggered) {
      clearTimeout(timer);
      res.send({
        runTime,
        memory: memoryUsage,
        status: status,
        output: output,
        error,
        answer: isExample ? testcase.output : "",
        testcase: isExample ? testcase : "",
      });
    }
  });
};

app.post("/v2/scoring", (req, res) => {
  const { code, testcase, timeLimit, memoryLimit, isExample } = req.body;
  let userCode = code;
  const input = testcase.input;

  userCode +=
    "\nprocess.send(solution(" + input.slice(1, input.length - 1) + "))";
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
      testcase: isExample ? testcase : "",
    });
  }, timeLimit);

  attatchChildProcessEvents(
    child,
    res,
    timer,
    startTime,
    memoryLimit,
    testcase,
    isExample
  );
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
