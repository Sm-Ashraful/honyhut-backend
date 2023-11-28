// paymentController.js

const { Client } = require("square");
const { randomUUID } = require("crypto");

BigInt.prototype.toJSON = function () {
  return this.toString();
};

const { paymentsApi } = new Client({
  accessToken:
    "EAAAEC0IU3HQ5QBTTuc6yhCDAbH1EBkiW_leNqHtcwPh5Kj1PhE4lOII-LnRxhNR",
  environment: "sandbox",
});

exports.CreatePayment = async (req, res) => {
  try {
    const { result } = await paymentsApi.createPayment({
      idempotencyKey: randomUUID(),
      sourceId: req.body.sourceId,
      amountMoney: {
        currency: "USD",
        amount: 1,
      },
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
