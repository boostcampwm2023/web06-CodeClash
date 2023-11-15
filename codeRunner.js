const express = require("express");
const { spawn } = require("child_process");
const fs = require("fs");

const app = express();
app.set("idle", true);

app.use(express.json());

const attatchChildProcessEvents = (child, res, timer, startTime, memoryLimit) => {
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

    if (timer.isTriggered) return;

    clearTimeout(timer);
    res.send({
      runTime,
      memory: memoryUsage,
      output,
      error,
    });

    app.set("idle", true);
  });
};
app.get("/v2/avaliable", (req, res) => {
  res.send({ avaliable: app.get("idle") });
});

app.post("/v2/scoring", (req, res) => {
  app.set("idle", false);

  const { code, testcase, timeLimit, memoryLimit } = req.body;
  let userCode = code;

  userCode += `\nconsole.log(solution(${testcase.parameters.join(", ")}));`;
  userCode += `\nprocess.send(process.memoryUsage());`;

  fs.writeFileSync("userCode.js", userCode);

  // delete cashe
  delete require.cache[require.resolve("./userCode")];
  const startTime = Date.now();
  const child = spawn("node", ["./userCode.js"], {
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

    app.set("idle", true);
  }, timeLimit);

  attatchChildProcessEvents(child, res, timer, startTime, memoryLimit);
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
