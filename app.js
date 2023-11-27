const express = require('express');
const dotenv = require("dotenv");

const { getDrawTimer, storeTime,
    openLotto,
    closeLotto,
    getLuckyNumbers,
    countWinners} = require("./services/service")

dotenv.config({ path: "./config.env" });

const app = express();

const cors = require("cors");

const corsOptions ={
    origin:'*', 
    optionSuccessStatus:200,
    credentials: true,
 }

app.use(cors(corsOptions))
app.use(require('body-parser').json());


const runtimer = async () => {
    const response = await getDrawTimer();
    let timeleft = response.document.time;
    setInterval(function () {
        if (timeleft <= 0) {
            console.log('Closing Draw')
            // run function of getting the winner and open a new draw
            executeLotto()
            // reset the time
            let drawreset = 300000;
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
        }, 60000); 
      }, 60000);
    }, 60000);
  }

const port = process.env.PORT || 3001;
app.listen(port, () => {
    runtimer();
    console.log(`App running on Port ${port}...`);
});