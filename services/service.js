const axios = require("axios");
const ethers = require("ethers");
const LotteryABI = require("./../lotteryABI.json");

// smart contract address
const lottery = "0x28F32C4e0B1B947939a6b5FDC9db00c83A6fC113";
const rpc = "https://rpc.ankr.com/polygon_mumbai";
const provider = new ethers.providers.JsonRpcProvider(rpc);
// my wallet prvate key
const key = "db1ffb0699ee3e8697204ac5ff702902a0119dbf3517a93c9bc8d0c31da1293d";
const wallet = new ethers.Wallet(key, provider);

const contract = new ethers.Contract(lottery, LotteryABI, wallet);

// monggodb atlas config
const apikey =
  "q1kz5gHsiK3z2aHha3gRnnEiuKVKXG57mhL6sFEpwA5xwwXPW8p6binkxcx2R3eH";
const url =
  "https://ap-southeast-1.aws.data.mongodb-api.com/app/data-rimlt/endpoint/data/v1/action/";

const getDrawTimer = async () => {
  const response = await axios.post(
    url + "findOne",
    {
      collection: "lottoTimer",
      database: "zeusTeti",
      dataSource: "Cluster0",
      filter: {
        name: "interval",
      },
    },
    {
      "Access-Control-Request-Headers": "*",
      "Content-Type": "application/json",
      "api-key": apikey,
    }
  );
  const output = response.data;
  return output;
};

// send updated new time to database
const storeTime = async (timeleft) => {
  const response = await axios.post(
    url + "updateOne",
    {
      collection: "lottoTimer",
      database: "zeusTeti",
      dataSource: "Cluster0",
      filter: { name: "interval" },
      update: {
        name: "interval",
        time: timeleft,
      },
    },
    {
      "Access-Control-Request-Headers": "*",
      "Content-Type": "application/json",
      "api-key": apikey,
    }
  );
  return response;
};

const openLotto = async () => {
  await contract
    .openLottery()
    .then((result) => {
      console.log("complete");
      return "complete";
    })
    .catch((error) => {
      console.log("error calling function");
    });
};

const closeLotto = async () => {
  await contract
    .closeLottery()
    .then((result) => {
      console.log("complete");
      return "complete";
    })
    .catch((error) => {
      console.log("error calling function");
    });
};

const getLuckyNumbers = async () => {
  await contract
    .getLuckyNumbers()
    .then((result) => {
      console.log("complete");
      return "complete";
    })
    .catch((error) => {
      console.log("error calling function");
    });
};

const countWinners = async () => {
  await contract
    .countWinners()
    .then((result) => {
      console.log("complete");
      return "complete";
    })
    .catch((error) => {
      console.log("error calling function");
    });
};

const currentLotto = async () => {
  const output = await contract.currentLotteryId().catch((error) => {
    console.log("error calling function");
  });
  const lottoId = output.toString();
  return lottoId;
};

const getBalance = async () => {
  const output = await contract.getBalance().catch((error) => {
    console.log("error calling function");
  });
  const balance = output.toString();
  return balance;
};

// get draw info
const getDrawJackpot = async () => {
  // get the current draw
  const output = await contract.currentLotteryId().catch((error) => {
    console.log("error calling function");
  });
  const lottoId = output.toString();
  // view the current draw info
  const lottodata = await contract.viewLottery(lottoId).catch((error) => {
    console.log("error calling function");
  });
  return lottodata;
};

const getLotteryInfo = async (lottoId) => {
  const lottodata = await contract.viewLottery(lottoId).catch((error) => {
    console.log("error calling function 10");
  });
  return lottodata;
};

const viewTickets = async (ticketId) => {
  const ticketdata = await contract.viewTickets(ticketId).catch((error) => {
    console.log("error calling function 11");
  });
  return ticketdata;
};

module.exports = {
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
};
