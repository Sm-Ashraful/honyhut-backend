// paymentController.js

const { Client } = require("square");
const { randomUUID } = require("crypto");

BigInt.prototype.toJSON = function () {
  return this.toString();
};

const { paymentsApi } = new Client({
  accessToken:
    "EAAAFCuKLKzM54TybuFemPGU8iEahx_WZVa-o3btVtSAxs41fL8p-ahhfJ-6ZDIA",
  environment: "sandbox",
});

exports.CreatePayment = async (req, res) => {
  const { sourceId, billingAddress, shippingAddress } = req.body;
  try {
    const { result } = await paymentsApi.createPayment({
      idempotencyKey: randomUUID(),
      sourceId: sourceId,
      amountMoney: {
        currency: "USD",
        amount: 1,
      },
      billingAddress: billingAddress,
      shippingAddress: shippingAddress,
      buyerEmailAddress: billingAddress.email,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
