const Transaction = require('../models/Transaction');

// @desc    Get all transactions
// @route   GET /api/v1/transactions
// @access  Public
exports.getTransactions = async (req, res, next) => {
  try {
    const skipQuery = parseInt(req.query.page) * 5;
    // TODO: move get all transaction without pagination to get all amounts
    const allTransactions = await Transaction.find();
    const transactions = await Transaction.find().skip(skipQuery).limit(5);
    const amounts = allTransactions.map((transaction) => transaction.amount);
    const totalIncome = amounts
      .filter((item) => item > 0)
      .reduce((acc, item) => (acc += item), 0) * 1
      .toFixed(2);
    const totalExpense = amounts
      .filter((item) => item < 0)
      .reduce((acc, item) => (acc += item), 0) * -1
      .toFixed(2);

    return res.status(200).json({
      success: true,
      totalTransactions: allTransactions.length,
      data: transactions,
      totalIncome,
      totalExpense
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}

// @desc    Add transaction
// @route   POST /api/v1/transactions
// @access  Public
exports.addTransaction = async (req, res, next) => {
  try {
    const { text, amount } = req.body;

    const transaction = await Transaction.create(req.body);
  
    return res.status(201).json({
      success: true,
      data: transaction
    }); 
  } catch (err) {
    if(err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);

      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
}

// @desc    Delete transaction
// @route   DELETE /api/v1/transactions/:id
// @access  Public
exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if(!transaction) {
      return res.status(404).json({
        success: false,
        error: 'No transaction found'
      });
    }

    await transaction.remove();

    return res.status(200).json({
      success: true,
      data: {}
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}
