const axios = require('axios');
const ethers = require('ethers');
const LotteryABI = require('./LotteryABI.json');

// smart contract address
const lottery = '0x162dE47cd373CDc146Cd9FB8ADe87C4554E79071';
const rpc = 'https://rpc.ankr.com/polygon_mumbai';
const provider = new ethers.providers.JsonRpcProvider(rpc);
// my wallet prvate key
const key = '0c3243e4ed64c89022e1ffc7cfc3d6e0ac785fb60e027a7a29b9a827b25efc15';
const wallet = new ethers.Wallet(key, provider);

const contract = new ethers.Contract(lottery, LotteryABI, wallet);

// monggodb atlas config
const apikey = "q1kz5gHsiK3z2aHha3gRnnEiuKVKXG57mhL6sFEpwA5xwwXPW8p6binkxcx2R3eH";
const url = "https://ap-southeast-1.aws.data.mongodb-api.com/app/data-rimlt/endpoint/data/v1/action/";


const getDrawTimer = async () => {
    const response = await axios.post(url + "findOne",
    {
        collection: "lottoTimer",
        database: "zeusTeti",
        dataSource: "Cluster0",
        filter: {
          name: "interval",
        },
      },
      {
        'Access-Control-Request-Headers': '*',
        "Content-Type": "application/json",
        "api-key": apikey,
      }
    )
    const output = response.data
    return output;
}

// send updated new time to database
const storeTime = async (timeleft) => {  
    const response = await axios.post(url + "updateOne",
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
        'Access-Control-Request-Headers': '*',
      "Content-Type": "application/json",
      "api-key": apikey,
    }
  );
  return response;
}

const openLotto = async () => {
    await contract.openLottery().then((result) => {
        console.log("complete");
        return "complete";
      }).catch((error) => {console.log("error calling function");});
  };

  const closeLotto = async () => {
    await contract.closeLottery().then((result) => {
        console.log("complete");
        return "complete";
      }).catch((error) => {console.log("error calling function");});
};

const getLuckyNumbers = async () => {
    await contract.getLuckyNumbers().then((result) => {
        console.log("complete");
        return "complete";
      }).catch((error) => {console.log("error calling function");});
};

const countWinners = async () => {
    await contract.countWinners().then((result) => {
        console.log("complete");
        return "complete";
      }).catch((error) => {console.log("error calling function");});
};


module.exports = {getDrawTimer, storeTime, openLotto, closeLotto, getLuckyNumbers, countWinners};