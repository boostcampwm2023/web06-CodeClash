const express = require("express");
const { spawn } = require("child_process");
const queue = require("express-queue");

const app = express();

app.use(express.json());
app.use(queue({ activeLimit: 1, queuedLimit: -1 }));

app.post("/v2/scoring", (req, res) => {
  const { code, testcase, timeLimit, memoryLimit, isExample } = req.body;
  let userCode = code;
  let output = "";
  let error = "";
  let childMessages = [];

  const input = testcase.input;

  userCode +=
    "\nprocess.send(String(solution(" +
    input.slice(1, input.length - 1) +
    ")))";
  userCode += "\nprocess.send(process.memoryUsage());";

  const startTime = Date.now();
  const child = spawn("node", ["-e", userCode], {
    stdio: ["pipe", "pipe", "pipe", "ipc"],
  });
  const memTracker = spawn("node", ["memoryTracker.js"], {
    stdio: ["pipe", "pipe", "pipe", "ipc"],
  });

  const timer = setTimeout(() => {
    child.kill();
    memTracker.kill();

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

    return;
  }, timeLimit);

  memTracker.send(child.pid);

  memTracker.on("message", (stats) => {
    let memoryUsage = stats.memory / 1000000;

    if (memoryUsage > memoryLimit) {
      child.kill();
      memTracker.kill();

      if (!timer.isTriggered) {
        res.send({
          runTime: 0,
          memory: memoryUsage,
          status: "fail",
          output: "",
          error: "Memory Limit Exceeded",
          answer: isExample ? testcase.output : "",
          testcase: isExample ? testcase : "",
        });

        return;
      }
    }
  });

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
      console.log(childMessages[0], testcase.output);

      memoryUsage = childMessages[1].rss / 1000000;
      status =
        String(childMessages[0]).trim() == String(testcase.output).trim()
          ? "pass"
          : "fail";
    } else {
      memoryUsage = 0;
      status = "fail";
    }

    if (memoryUsage > memoryLimit) {
      error = "Memory Limit Exceeded";
    }

    if (!timer.isTriggered) {
      clearTimeout(timer);
      memTracker.kill();

      res.send({
        runTime,
        memory: memoryUsage,
        status: status,
        output: output,
        error,
        answer: isExample ? testcase.output : "",
        testcase: isExample ? testcase : "",
      });

      return;
    }
  });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
