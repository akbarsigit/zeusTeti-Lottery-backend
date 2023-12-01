const express = require("express");
const dotenv = require("dotenv");

const {
  currentLotto,
  getDrawTimer,
  getLotteryInfo,
  viewTickets,
  storeTime,
  openLotto,
  closeLotto,
  getLuckyNumbers,
  countWinners,
  getBalance,
  getDrawJackpot,
} = require("./services/service");

dotenv.config({ path: "./config.env" });

const app = express();

const cors = require("cors");

const corsOptions = {
  origin: "*",
  optionSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(require("body-parser").json());

const runtimer = async () => {
  const response = await getDrawTimer();
  let timeleft = response.document.time;
  setInterval(function () {
    if (timeleft <= 0) {
      console.log("Closing Draw");
      // run function of getting the winner and open a new draw
      executeLotto();
      // reset the time
      let drawreset = 720000;
      storeTime(drawreset);
      timeleft = drawreset;
    } else {
      // decrease the timestamp
      console.log(timeleft);
      timeleft -= 1000;
      storeTime(timeleft);
    }
  }, 1000);
};

app.post("/currentlotto", function (req, res) {
  return new Promise((resolve, reject) => {
    currentLotto()
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Cache-Control", "max-age=180000");
        res.end(JSON.stringify(response));
        resolve();
      })
      .catch((error) => {
        res.json(error);
        res.status(405).end();
      });
  });
});

app.post("/getdrawjackpot", function (req, res) {
  return new Promise((resolve, reject) => {
    getDrawJackpot()
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Cache-Control", "max-age=180000");
        res.end(JSON.stringify(response));
        resolve();
      })
      .catch((error) => {
        res.json(error);
        res.status(405).end();
      });
  });
});

app.post("/backendtimer", function (req, res) {
  return new Promise((resolve, reject) => {
    getDrawTimer()
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Cache-Control", "max-age=180000");
        res.end(JSON.stringify(response));
        resolve();
      })
      .catch((error) => {
        res.json(error);
        res.status(405).end();
      });
  });
});

app.post("/getbalance", function (req, res) {
  return new Promise((resolve, reject) => {
    getBalance()
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Cache-Control", "max-age=180000");
        res.end(JSON.stringify(response));
        resolve();
      })
      .catch((error) => {
        res.json(error);
        res.status(405).end();
      });
  });
});

app.post("/viewlotto", function (req, res) {
  const lottoId = req.body.lottoId;
  return new Promise((resolve, reject) => {
    getLotteryInfo(lottoId)
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Cache-Control", "max-age=180000");
        res.end(JSON.stringify(response));
        resolve();
      })
      .catch((error) => {
        res.json(error);
        res.status(405).end();
      });
  });
});

app.post("/viewtickets", function (req, res) {
  const ticketId = req.body.ticketId;
  return new Promise((resolve, reject) => {
    viewTickets(ticketId)
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Cache-Control", "max-age=180000");
        res.end(JSON.stringify(response));
        resolve();
      })
      .catch((error) => {
        res.json(error);
        res.status(405).end();
      });
  });
});

// wait 60s for each function. Wain on the smartcontract
function executeLotto() {
  console.log("closing draw");
  // close the draw
  closeLotto();
  setTimeout(function () {
    console.log("Getting Draw Number");
    getLuckyNumbers();
    setTimeout(function () {
      // count the winner
      console.log("winners");
      countWinners();
      setTimeout(function () {
        // open new draw
        console.log("open");
        openLotto();
      }, 180000);
    }, 180000);
  }, 180000);
}

const port = process.env.PORT || 3001;
app.listen(port, () => {
  runtimer();
  console.log(`App running on Port ${port}...`);
});
