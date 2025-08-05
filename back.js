const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')


const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

(async function connectdb() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/Bankdb');
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
})();

app.listen(8001, () => {
  console.log("🚀 Server started on port 8001");
});

// Define Mongoose Schema and Model
const accountSchema = new mongoose.Schema({
  Name: String,
  Email: String,
  AccountNumber: Number,
  Phone: String,
  Balance: Number,
  Pin: String
});

const Account = mongoose.model("tblAccounts", accountSchema);


app.post('/createAccount', async (req, res) => {
  try {
    const accountNumber = Math.floor(Math.random() * 900000) + 100000;

    const clientData = {
      Name: req.body.Name,
      Email: req.body.Email,
      AccountNumber: accountNumber,
      Phone: req.body.Phone,
      Balance: req.body.Deposit,
      Pin: req.body.Pin
    };

    const newAccount = new Account(clientData);
    await newAccount.save(); // Save to MongoDB

    res.status(200).send(`Account created successfully.Your Account Number is ${accountNumber}`);
  } catch (error) {
    console.error("❌ Error creating account:", error);
    res.status(500).send("Error creating account. Please try again later.");
  }
});

app.put('/Deposit', async (req, res) => {
  const { accNumber, pinNumber, balance } = req.body;

  try {
    const result = await Account.updateOne(
      { AccountNumber: accNumber, Pin: pinNumber },
      { $set: { Balance: balance } }
    );

    if (result.modifiedCount > 0) {
      res.send("Balance Updated successfully");
    }
    else {
      res.status(404).send("Account not found or no change in balance");
    }
  }
  catch (error) {
    res.status(500).send("❌ Error updating balance");
  }
});



app.post('/accountValid', async (req, res) => {
  const AccountNumber =  parseInt(req.body.acc);
  console.log("Received AccountNumber:", AccountNumber);
  try {
    const user = await Account.findOne({ AccountNumber: AccountNumber });
    console.log("User found?", user);

    if (user) {
      res.json({ found: true, balance: user.Balance });
    } else {
      res.json({ found: false });
    }
  } catch (error) {
    console.error("Error in /validAccount:", error);
    res.status(500).json({ found: false, error: true });
  }
});




app.post('/validPin', async (req, res) => {
  const pinNumber = parseInt(req.body.Pin);

  try {
    const user = await Account.findOne({ Pin: pinNumber });

    if (user) {
      res.json({ found: true });
    } else {
      res.json({ found: false });
    }
  } catch (error) {
    console.error("Error in /validPin:", error);
    res.status(500).json({ found: false, error: true });
  }

});