// const stripe = require("stripe")("sk_test_tR3PYbcVNZZ796tH88S4VQ2u");
// const express = require("express");
// const app = express();
// const cors = require("cors");
// app.use(cors());

// // let connectionToken = stripe.terminal.connectionTokens
// //   .create()
// //   .then((result) => {
// //     console.log("result ------", result);
// //   });
// // console.log("connection token ------", connectionToken);

// app.post("/connection_token", async (req, res) => {
//   const token = await stripe.terminal.connectionTokens.create();
//   res.json({ secret: token.secret }); // ... Fetch or create the ConnectionToken
// });

// app.listen(3000, () => {
//   console.log("Running on port 3000");
// });

// // stripe secret key:
// // pst_test_YWNjdF8xQlRVREdKQUpmWmI5SEVCLE42RTh1cjZkY2gxWHlncmNiVzZiVkx0NGVPTmROMmM_00B2iRjiQn

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const stripe = require("stripe")(
  "sk_test_51JU09ZSComLt2NW6F2V7O1xNFnIFd3hcbAVD95fJ3TjU6IaoGyenjvHEqRHiuAy5eU6YkeNmG85tLg7Oi7e9VbSh00OungBFKk"
); // Add your Secret Key Here

const app = express();

// This will make our form data much more useful
// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// This will set express to render our views folder, then to render the files as normal html
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

app.use(express.static(path.join(__dirname, "./views")));

// Future Code Goes Here
app.post("/charge", (req, res) => {
  console.log("res -------,", req.body);
  try {
    stripe.customers
      .create({
        name: req.body.name,
        email: req.body.email,
        source: req.body.stripeToken,
      })
      .then((customer) =>
        stripe.charges.create({
          amount: req.body.amount * 100,
          currency: "inr",
          customer: customer.id,
          description: "Software development services",
          shipping: {
            name: "Jenny Rosen",
            address: {
              line1: "510 Townsend St",
              postal_code: "98140",
              city: "San Francisco",
              state: "CA",
              country: "US",
            },
          },
        })
      )
      .then(() => res.render("completed.html"))
      .catch((err) => console.log(err));
  } catch (err) {
    res.send(err);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server is running..."));
