const pidusage = require("pidusage");

process.on("message", (pid) => {
  setInterval(() => {
    pidusage(pid, (err, stats) => {
      process.send(stats);
    });
  }, 10);
});
