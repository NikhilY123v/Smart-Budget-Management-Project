document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("budget-form");
  const resetButton = document.getElementById("reset-btn");
  const typeInput = document.getElementById("type");
  const dateInput = document.getElementById("date");
  const categoryInput = document.getElementById("category");
  const amountInput = document.getElementById("amount");
  const totalIncomeEl = document.getElementById("total-income");
  const totalExpenseEl = document.getElementById("total-expense");
  const balanceEl = document.getElementById("balance");
  const transactionList = document.getElementById("transaction-list");
  const chartCanvas = document.getElementById("budget-chart");

  let totalIncome = 0;
  let totalExpense = 0;
  let chart;

  // Function to update the pie chart
  const updateChart = () => {
      const balance = totalIncome - totalExpense;

      if (chart) {
          chart.destroy();
      }

      chart = new Chart(chartCanvas, {
          type: "pie",
          data: {
              labels: ["Total Expenses", "Balance"],
              datasets: [
                  {
                      data: [totalExpense, balance],
                      backgroundColor: ["#dc3545", "#007bff"],
                  },
              ],
          },
          options: {
              responsive: true,
              plugins: {
                  legend: {
                      display: true,
                  },
                  tooltip: {
                      callbacks: {
                          label: function (tooltipItem) {
                              return `${tooltipItem.label}: Rs ${tooltipItem.raw.toFixed(2)}`;
                          },
                      },
                  },
              },
          },
      });
  };

  // Function to update the summary
  const updateSummary = () => {
      const balance = totalIncome - totalExpense;
      totalIncomeEl.textContent = totalIncome.toFixed(2);
      totalExpenseEl.textContent = totalExpense.toFixed(2);
      balanceEl.textContent = balance.toFixed(2);

      // Show a warning if expenses exceed income
      if (totalExpense > totalIncome) {
          alert("Warning: Your expenses exceed your income!");
      }

      updateChart();
  };

  // Event listener for form submission
  form.addEventListener("submit", (event) => {
      event.preventDefault();

      const type = typeInput.value;
      const date = dateInput.value;
      const category = categoryInput.value;
      const amount = parseFloat(amountInput.value);

      if (!date || isNaN(amount) || amount <= 0) {
          alert("Please fill out all fields with valid data.");
          return;
      }

      if (type === "income") {
          totalIncome += amount;
      } else {
          totalExpense += amount;
      }

      // Add the transaction to the history
      const listItem = document.createElement("li");
      listItem.textContent = `${date} : ${type === "income" ? "+" : "-"} Rs${amount.toFixed(2)} (${category})`;
      transactionList.appendChild(listItem);

      updateSummary();

      // Clear input fields
      categoryInput.value = "";
      amountInput.value = "";
      dateInput.value = "";
  });

  // Event listener for resetting data
  resetButton.addEventListener("click", () => {
      totalIncome = 0;
      totalExpense = 0;
      transactionList.innerHTML = "";
      updateSummary();
  });

  updateSummary(); // Initialize chart and summary
});
