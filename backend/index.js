const express = require("express");
const Moralis = require("moralis").default;
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = 3001;
const ABI = require("./abi.json");
app.use(cors());
app.use(express.json());

function convertArrayToObjects(arr) {
  const dataArray = arr.map((transaction, index) => ({
    key: (arr.length + 1 - index).toString(),
    type: transaction[0],
    amount: transaction[1],
    message: transaction[2],
    address: `${transaction[3].slice(0, 4)}...${transaction[3].slice(38)}`,
    subject: transaction[4],
  }));

  return dataArray.reverse();
}

app.get("/getNameAndBalance", async (req, res) => {
  const { userAddress } = req.query;
 

  try {
    const response = await Moralis.EvmApi.utils.runContractFunction({
      chain: "11155111",
      address: "0x2821C5c18549BDAD5076fC829CACB414380978dE",
      functionName: "getMyName",
      abi: ABI,
      params: { _user: userAddress },
    });

    const jsonResponseName = response.raw;

    const secResponse = await Moralis.EvmApi.balance.getNativeBalance({
      chain: "11155111",
      address: userAddress,
    });
    const jsonResponseBal = (secResponse.raw.balance / 1e18).toFixed(2);

    const thirResponse = await Moralis.EvmApi.token.getTokenPrice({
      chain: "0x1",
      include: "percent_change",
      address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
    });

    const jsonResponseDollars = (
      thirResponse.raw.usdPrice * jsonResponseBal
    ).toFixed(2);

    const fourResponse = await Moralis.EvmApi.utils.runContractFunction({
      chain: "11155111",
      address: "0x2821C5c18549BDAD5076fC829CACB414380978dE",
      functionName: "getMyHistory",
      abi: ABI,
      params: { _user: userAddress },
    });

    const jsonResponseHistory = convertArrayToObjects(fourResponse.raw);

    const fiveResponse = await Moralis.EvmApi.utils.runContractFunction({
      chain: "11155111",
      address: "0x2821C5c18549BDAD5076fC829CACB414380978dE",
      functionName: "getMyRequests",
      abi: ABI,
      params: { _user: userAddress },
    });

    const jsonResponseRequests = fiveResponse.raw;

    const jsonResponse = {
      name: jsonResponseName,
      balance: jsonResponseBal,
      dollars: jsonResponseDollars,
      history: jsonResponseHistory,
      requests: jsonResponseRequests,
    };

    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
});

Moralis.start({
  apiKey: process.env.MORALIS_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening for API Calls`);
  });
});
