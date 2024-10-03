const express = require("express");
const cors = require("cors");
const knex = require("knex")(require("./db/knexfile").development);

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cors());

app.get("/users", async (req, res) => {
  try {
    const users = await knex("users");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
});
// Create a new user
app.post("/users", async (req, res) => {
  const { name } = req.body;
  try {
    const [userId] = await knex("users").insert({ name }).returning("id");
    res.status(201).json({ message: "User created", userId });
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Get user balance
app.get("/users/:id/balance", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await knex("users").where({ id }).first();
    if (user) {
      const balance = user.balance / 100; // Convert from cents to euros
      res.json({ balance });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve balance" });
  }
});

// Send money from one user to another
app.post("/transactions", async (req, res) => {
  const { senderId, receiverId, amount } = req.body; // amount in euros

  const amountInCents = Math.round(amount * 100); // Convert to cents

  try {
    // Check if sender and receiver exist
    const sender = await knex("users").where({ id: senderId }).first();
    const receiver = await knex("users").where({ id: receiverId }).first();

    if (!sender || !receiver) {
      return res.status(404).json({ error: "Sender or receiver not found" });
    }

    if (sender.balance < amountInCents) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Start transaction to ensure atomic operations
    await knex.transaction(async (trx) => {
      await trx("users")
        .where({ id: senderId })
        .decrement("balance", amountInCents);
      await trx("users")
        .where({ id: receiverId })
        .increment("balance", amountInCents);

      // Record the transaction
      await trx("transactions").insert({
        sender_id: senderId,
        receiver_id: receiverId,
        amount: amountInCents,
      });
    });

    res.status(201).json({ message: "Transaction successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Transaction failed" });
  }
});

// Get all transactions for a user
app.get("/users/:id/transactions", async (req, res) => {
  const { id } = req.params;
  try {
    const transactions = await knex("transactions")
      .where({ sender_id: id })
      .orWhere({ receiver_id: id });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve transactions" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
