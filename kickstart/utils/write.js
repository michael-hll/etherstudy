const fs = require('fs');

function WriteFile(filename, jsonObj) {
  fs.writeFile(
    filename,
    JSON.stringify(jsonObj, null, 2),
    {
      encoding: "utf8",
      flag: "w",
      mode: 0o666
    },
    (err) => {
      if (err)
        console.log(err);
      else {
        console.log("File written successfully: " + filename);
      }
    });
}

module.exports = WriteFile;