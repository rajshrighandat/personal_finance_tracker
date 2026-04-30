// Global variables
let transactions = [];
let filteredTransactions = [];
let currentEditId = null;
let expenseChart = null;
let incomeExpenseChart = null;
const API_BASE_URL = 'http://localhost:3000/api';

// DOM Elements
const transactionForm = document.getElementById('transactionForm');
const tableBody = document.getElementById('tableBody');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpenseEl = document.getElementById('totalExpense');
const balanceEl = document.getElementById('balance');
const alertContainer = document.getElementById('alertContainer');
const dateInput = document.getElementById('date');

// Filter elements
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const typeFilter = document.getElementById('typeFilter');
const dateFromFilter = document.getElementById('dateFromFilter');
const dateToFilter = document.getElementById('dateToFilter');
const resetFilterBtn = document.getElementById('resetFilterBtn');

// Modal elements
const editModal = document.getElementById('editModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalClose = document.querySelector('.close');
const editForm = document.getElementById('editForm');
const editAmount = document.getElementById('editAmount');
const editType = document.getElementById('editType');
const editCategory = document.getElementById('editCategory');
const editDate = document.getElementById('editDate');
const cancelBtn = document.getElementById('cancelBtn');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  setTodayDate();
  fetchTransactions();
  transactionForm.addEventListener('submit', handleAddTransaction);
  
  // Filter listeners
  searchInput.addEventListener('input', applyFilters);
  categoryFilter.addEventListener('change', applyFilters);
  typeFilter.addEventListener('change', applyFilters);
  dateFromFilter.addEventListener('change', applyFilters);
  dateToFilter.addEventListener('change', applyFilters);
  resetFilterBtn.addEventListener('click', resetFilters);
  
  // Modal listeners
  closeModalBtn.addEventListener('click', closeEditModal);
  modalClose.addEventListener('click', closeEditModal);
  editForm.addEventListener('submit', handleEditSubmit);
  cancelBtn.addEventListener('click', cancelEdit);
  
  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === editModal) closeEditModal();
  });
});

// Set today's date as default
function setTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  dateInput.value = `${year}-${month}-${day}`;
}

// Fetch all transactions
async function fetchTransactions() {
  try {
    const response = await fetch(`${API_BASE_URL}/all`);
    const result = await response.json();

    if (result.success) {
      transactions = result.data;
      filteredTransactions = transactions;
      renderTable();
      updateSummary();
      updateCharts();
    } else {
      showAlert('Error fetching transactions', 'error');
    }
  } catch (error) {
    console.error('Error fetching transactions:', error);
    showAlert('Failed to fetch transactions', 'error');
  }
}

// Handle add/update transaction form submission
async function handleAddTransaction(e) {
  e.preventDefault();

  const amount = parseFloat(document.getElementById('amount').value);
  const type = document.getElementById('type').value;
  const category = document.getElementById('category').value;
  const date = document.getElementById('date').value;

  // Validation
  if (!amount || amount <= 0) {
    showAlert('Please enter a valid amount', 'error');
    return;
  }

  if (!type) {
    showAlert('Please select a type', 'error');
    return;
  }

  if (!category) {
    showAlert('Please select a category', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        type,
        category,
        date: new Date(date),
      }),
    });

    const result = await response.json();

    if (result.success) {
      showAlert('Transaction added successfully!', 'success');
      transactionForm.reset();
      setTodayDate();
      fetchTransactions();
    } else {
      showAlert(result.message || 'Error adding transaction', 'error');
    }
  } catch (error) {
    console.error('Error adding transaction:', error);
    showAlert('Failed to add transaction', 'error');
  }
}

// Open edit modal
function openEditModal(id) {
  const transaction = transactions.find(t => t._id === id);
  if (!transaction) return;

  currentEditId = id;
  editAmount.value = transaction.amount;
  editType.value = transaction.type;
  editCategory.value = transaction.category;
  
  const date = new Date(transaction.date);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  editDate.value = `${year}-${month}-${day}`;

  editModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

// Close edit modal
function closeEditModal() {
  editModal.classList.remove('show');
  document.body.style.overflow = 'auto';
  currentEditId = null;
}

// Cancel edit mode
function cancelEdit() {
  transactionForm.reset();
  setTodayDate();
  formTitle.textContent = 'Add Transaction';
  submitBtn.textContent = 'Add Transaction';
  cancelBtn.style.display = 'none';
  currentEditId = null;
  closeEditModal();
}

// Handle edit form submission
async function handleEditSubmit(e) {
  e.preventDefault();

  if (!currentEditId) return;

  const amount = parseFloat(editAmount.value);
  const type = editType.value;
  const category = editCategory.value;
  const date = editDate.value;

  if (!amount || amount <= 0) {
    showAlert('Please enter a valid amount', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/update/${currentEditId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        type,
        category,
        date: new Date(date),
      }),
    });

    const result = await response.json();

    if (result.success) {
      showAlert('Transaction updated successfully!', 'success');
      closeEditModal();
      fetchTransactions();
    } else {
      showAlert(result.message || 'Error updating transaction', 'error');
    }
  } catch (error) {
    console.error('Error updating transaction:', error);
    showAlert('Failed to update transaction', 'error');
  }
}

// Delete transaction
async function deleteTransaction(id) {
  if (!confirm('Are you sure you want to delete this transaction?')) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (result.success) {
      showAlert('Transaction deleted successfully!', 'success');
      fetchTransactions();
    } else {
      showAlert(result.message || 'Error deleting transaction', 'error');
    }
  } catch (error) {
    console.error('Error deleting transaction:', error);
    showAlert('Failed to delete transaction', 'error');
  }
}

// Apply filters
function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;
  const selectedType = typeFilter.value;
  const dateFrom = dateFromFilter.value ? new Date(dateFromFilter.value) : null;
  const dateTo = dateToFilter.value ? new Date(dateToFilter.value) : null;

  filteredTransactions = transactions.filter(transaction => {
    // Search filter
    if (searchTerm) {
      const matchesSearch = 
        transaction.category.toLowerCase().includes(searchTerm) ||
        transaction.amount.toString().includes(searchTerm) ||
        transaction.type.toLowerCase().includes(searchTerm);
      if (!matchesSearch) return false;
    }

    // Category filter
    if (selectedCategory && transaction.category !== selectedCategory) return false;

    // Type filter
    if (selectedType && transaction.type !== selectedType) return false;

    // Date range filter
    if (dateFrom && dateTo) {
      const transactionDate = new Date(transaction.date);
      if (transactionDate < dateFrom || transactionDate > dateTo) return false;
    } else if (dateFrom) {
      const transactionDate = new Date(transaction.date);
      if (transactionDate < dateFrom) return false;
    } else if (dateTo) {
      const transactionDate = new Date(transaction.date);
      if (transactionDate > dateTo) return false;
    }

    return true;
  });

  renderTable();
  updateSummary();
  updateCharts();
}

// Reset filters
function resetFilters() {
  searchInput.value = '';
  categoryFilter.value = '';
  typeFilter.value = '';
  dateFromFilter.value = '';
  dateToFilter.value = '';
  filteredTransactions = transactions;
  renderTable();
  updateSummary();
  updateCharts();
}

// Render transactions table
function renderTable() {
  if (filteredTransactions.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="6" class="empty-message">No transactions found. Add one to get started!</td></tr>';
    return;
  }

  tableBody.innerHTML = filteredTransactions
    .map((transaction) => {
      const date = new Date(transaction.date);
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      const typeClass = `type-${transaction.type}`;
      const amountClass = `amount-${transaction.type}`;
      const typeLabel = transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1);

      return `
        <tr>
          <td>${formattedDate}</td>
          <td>${transaction.category}</td>
          <td><span class="${typeClass}">${typeLabel}</span></td>
          <td><span class="${amountClass}">$${parseFloat(transaction.amount).toFixed(2)}</span></td>
          <td>
            <button class="btn btn-edit" onclick="openEditModal('${transaction._id}')">Edit</button>
            <button class="btn btn-delete" onclick="deleteTransaction('${transaction._id}')">Delete</button>
          </td>
        </tr>
      `;
    })
    .join('');
}

// Update summary cards
function updateSummary() {
  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const balance = totalIncome - totalExpense;

  totalIncomeEl.textContent = totalIncome.toFixed(2);
  totalExpenseEl.textContent = totalExpense.toFixed(2);
  balanceEl.textContent = balance.toFixed(2);

  // Update balance color based on positive or negative
  const balanceCard = document.querySelector('.balance-card');
  if (balance < 0) {
    balanceCard.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
  } else {
    balanceCard.style.background = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
  }
}

// Update charts
function updateCharts() {
  updateExpenseChart();
  updateIncomeExpenseChart();
}

// Update expense distribution chart
function updateExpenseChart() {
  const expenses = filteredTransactions.filter(t => t.type === 'expense');
  const categoryMap = {};

  expenses.forEach(expense => {
    categoryMap[expense.category] = (categoryMap[expense.category] || 0) + parseFloat(expense.amount);
  });

  const labels = Object.keys(categoryMap);
  const data = Object.values(categoryMap);

  const ctx = document.getElementById('expenseChart').getContext('2d');

  const palette = [
    '#16a34a',
    '#0ea5e9',
    '#f97316',
    '#a855f7',
    '#38bdf8',
    '#facc15',
    '#14b8a6',
    '#ef4444',
    '#8b5cf6',
    '#22c55e',
  ];

  const colors = labels.map((label, index) => palette[index % palette.length]);

  if (expenseChart) {
    expenseChart.data.labels = labels;
    expenseChart.data.datasets[0].data = data;
    expenseChart.data.datasets[0].backgroundColor = colors;
    expenseChart.update();
  } else {
    expenseChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          hoverOffset: 10,
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    });
  }
}

// Update income vs expense chart
function updateIncomeExpenseChart() {
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const ctx = document.getElementById('incomeExpenseChart').getContext('2d');

  const barColors = [
    'rgba(34, 197, 94, 0.85)',
    'rgba(239, 68, 68, 0.85)',
  ];
  const borderColors = [
    'rgb(22, 163, 74)',
    'rgb(220, 38, 38)',
  ];

  if (incomeExpenseChart) {
    incomeExpenseChart.data.datasets[0].data = [totalIncome, totalExpense];
    incomeExpenseChart.data.datasets[0].backgroundColor = barColors;
    incomeExpenseChart.data.datasets[0].borderColor = borderColors;
    incomeExpenseChart.update();
  } else {
    incomeExpenseChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Income', 'Expense'],
        datasets: [{
          label: 'Amount ($)',
          data: [totalIncome, totalExpense],
          backgroundColor: barColors,
          borderColor: borderColors,
          borderWidth: 1,
          borderRadius: 8,
        }],
      },
      options: {
        responsive: true,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}

// Show alert
function showAlert(message, type) {
  const alertEl = document.createElement('div');
  alertEl.className = `alert ${type}`;
  alertEl.textContent = message;

  alertContainer.appendChild(alertEl);

  // Remove alert after 4 seconds
  setTimeout(() => {
    alertEl.classList.add('removing');
    setTimeout(() => {
      alertEl.remove();
    }, 300);
  }, 4000);
}
