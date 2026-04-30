require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { connectDB, Transaction } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
connectDB();

// API Routes

// GET all transactions
app.get('/api/all', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching transactions',
      error: error.message,
    });
  }
});

// POST add transaction
app.post('/api/add', async (req, res) => {
  try {
    const { amount, type, category, date } = req.body;

    // Validation
    if (!amount || !type || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be either income or expense',
      });
    }

    const newTransaction = new Transaction({
      amount,
      type,
      category,
      date: date ? new Date(date) : new Date(),
    });

    const savedTransaction = await newTransaction.save();
    res.status(201).json({
      success: true,
      message: 'Transaction added successfully',
      data: savedTransaction,
    });
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding transaction',
      error: error.message,
    });
  }
});

// PUT update transaction
app.put('/api/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, type, category, date } = req.body;

    // Validation
    if (!amount || !type || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be either income or expense',
      });
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      {
        amount,
        type,
        category,
        date: date ? new Date(date) : new Date(),
      },
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      data: updatedTransaction,
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating transaction',
      error: error.message,
    });
  }
});

// DELETE transaction
app.delete('/api/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
      data: deletedTransaction,
    });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting transaction',
      error: error.message,
    });
  }
});

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
