const express = require('express');
const app = express();
const port = 80;

app.get('/okteto/up', (req, res) => {
  const { spawn } = require('child_process');
  const cmd = spawn('ls', ['-lh', '/']);

  cmd.stdout.on('data', (data) => {
    // Add data to stream.
    res.write(data);
    console.log(`stdout: ${data}`);
  });

  cmd.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  cmd.on('close', (code) => {
    // Finish stream.
    res.status(200).send();
    console.log(`child process exited with code ${code}`);
  });
});

app.listen(port, () => {
  console.log(`Okteto backend listening on port ${port}`)
});
