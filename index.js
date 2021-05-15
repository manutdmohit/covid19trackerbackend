const http = require("http");
const fs = require("fs");
const requests = require("requests");

const homeFile = fs.readFileSync("index.html", "utf-8");

const port = process.env.PORT || 8000;

const replaceVal = (home, orgData) => {
  info = home.replace("{tCases}", orgData.cases);
  info = info.replace("{tDeaths}", orgData.deaths);
  info = info.replace("{tRecovered}", orgData.recovered);
  info = info.replace("{newCases}", orgData.todayCases);
  info = info.replace("{todayDeaths}", orgData.todayDeaths);
  return info;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests("https://corona.lmao.ninja/v2/countries/nepal")
      .on("data", (chunk) => {
        const data = JSON.parse(chunk);
        const realTimeData = replaceVal(homeFile, data);

        res.write(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log("The connection is successful");
});
