const { response } = require("express");
const Cart = require("../models/cart");

exports.addItemToCart = async (req, res) => {
  await Cart.findOne({ user: req.user._id })
    .exec()
    .then((cart) => {
      if (cart) {
        //if cart already exists then update cart by quantity
        const product = req.body.cartItems.product;
        const item = cart.cartItems.find((c) => c.product == product);
        let condition, update;
        if (item) {
          condition = { user: req.user._id, "cartItems.product": product };
          update = {
            $set: {
              "cartItems.$": {
                ...req.body.cartItems,
                quantity: item.quantity + req.body.cartItems.quantity,
              },
            },
          };
        } else {
          condition = { user: req.user._id };
          update = {
            $push: {
              cartItems: req.body.cartItems,
            },
          };
        }
        Cart.findOneAndUpdate(condition, update)
          .exec()
          .then((_cart) => {
            if (_cart) {
              return res.status(200).json({ cart: _cart });
            }
          })
          .catch((error) => {
            if (error) {
              return res.status(400).json({ error });
            }
          });
      } else {
        // if cart not exists then create a new cart
        const cart = new Cart({
          user: req.user._id,
          cartItems: [req.body.cartItems],
        });

        cart
          .save()
          .then((cart) => {
            return res.status(201).json({ cart });
          })
          .catch((error) => {
            if (error) return res.status(400).json({ error });
          });
      }
    });
  // if (error) return res.status(400).json({ error });
};
