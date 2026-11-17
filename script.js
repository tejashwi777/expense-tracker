
// ======================================
// 🎀 PINKY WALLET — MAIN JAVASCRIPT 2.0
// ======================================

// ---------- TRANSACTIONS ----------

let transactions = JSON.parse(
  localStorage.getItem("pinkyTransactions") || "[]"
);

let budget = Number(
  localStorage.getItem("pinkyBudget") || 0
);

let chart;

function saveTransactions() {
  localStorage.setItem(
    "pinkyTransactions",
    JSON.stringify(transactions)
  );
}

// ---------- DASHBOARD ----------

function updateDashboard() {
  const income = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

  document.getElementById("balance").textContent =
    `Rs. ${balance.toFixed(2)}`;

  document.getElementById("income").textContent =
    `Rs. ${income.toFixed(2)}`;

  document.getElementById("expense").textContent =
    `Rs. ${expense.toFixed(2)}`;

  document.getElementById("savings").textContent =
    `Rs. ${balance.toFixed(2)}`;

  renderTransactions();
  updateBudget(expense);
  updateChart();
}

// ---------- TRANSACTION DISPLAY ----------

function renderTransactions() {
  const list = document.getElementById("transactionList");
  list.innerHTML = "";

  if (transactions.length === 0) {
    list.textContent =
      "No transactions yet. Add your first one! 🌷";
    return;
  }

  transactions.forEach((t, index) => {
    const item = document.createElement("div");
    item.className = "transaction";

    const info = document.createElement("div");

    const title = document.createElement("strong");
    title.textContent = `${t.icon} ${t.title}`;

    const details = document.createElement("small");
    details.textContent = `${t.category} • ${t.date}`;

    info.append(title, details);

    const right = document.createElement("div");

    const amount = document.createElement("strong");
    amount.className = t.type;
    amount.textContent =
      `${t.type === "income" ? "+" : "-"} Rs. ${t.amount.toFixed(2)}`;

    const remove = document.createElement("button");
    remove.className = "delete";
    remove.textContent = "✕";
    remove.setAttribute("aria-label", "Delete transaction");

    remove.addEventListener("click", () => {
      transactions.splice(index, 1);
      saveTransactions();
      updateDashboard();
    });

    right.append(amount, remove);
    item.append(info, right);
    list.appendChild(item);
  });
}

// ---------- ADD TRANSACTION ----------

document.getElementById("transactionForm")
  .addEventListener("submit", function(event) {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const amount = Number(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value;

    if (!title || !Number.isFinite(amount) || amount <= 0) {
      alert("Please enter a valid name and amount 💗");
      return;
    }

    const icons = {
      Food: "🍓",
      Shopping: "🛍️",
      Transport: "🚕",
      Education: "📚",
      Entertainment: "🎬",
      Salary: "💵",
      Other: "🌸"
    };

    transactions.unshift({
      title,
      amount,
      type,
      category,
      icon: icons[category] || "🌷",
      date: new Date().toLocaleDateString()
    });

    saveTransactions();
    this.reset();
    updateDashboard();
  });

// ---------- MONTHLY BUDGET ----------

document.getElementById("budgetButton")
  .addEventListener("click", () => {
    const value = Number(
      document.getElementById("budgetInput").value
    );

    if (!Number.isFinite(value) || value <= 0) {
      alert("Please enter a valid budget 🎀");
      return;
    }

    budget = value;
    localStorage.setItem("pinkyBudget", budget);
    updateDashboard();
  });

function updateBudget(expense) {
  const progress = document.getElementById("budgetProgress");
  const status = document.getElementById("budgetStatus");

  document.getElementById("budgetInput").value =
    budget || "";

  if (!budget) {
    progress.style.width = "0%";
    status.textContent =
      "Set your monthly budget to get started ♡";
    return;
  }

  const percentage = expense / budget * 100;

  progress.style.width = Math.min(percentage, 100) + "%";

  status.textContent =
    `Rs. ${expense.toFixed(2)} spent out of Rs. ${budget.toFixed(2)} (${percentage.toFixed(1)}%)`;

  progress.style.background =
    percentage > 100 ? "#d85b85" : "";
}

// ---------- SPENDING CHART ----------

function updateChart() {
  const categories = {};

  transactions
    .filter(t => t.type === "expense")
    .forEach(t => {
      categories[t.category] =
        (categories[t.category] || 0) + t.amount;
    });

  const labels = Object.keys(categories);
  const values = Object.values(categories);

  document.getElementById("chartMessage").textContent =
    labels.length
      ? "Your spending by category ♡"
      : "Add expenses to see your chart!";

  const isMidnight =
    document.body.classList.contains("midnight-theme");

  const canvas = document.getElementById("expenseChart");

  if (chart) chart.destroy();

  chart = new Chart(canvas, {
    type: "doughnut",

    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: [
          "#efa4c2",
          "#d981a9",
          "#f6c4d8",
          "#c98baa",
          "#f5d9e5",
          "#e6a0ad",
          "#f2b9a8"
        ],
        borderWidth: 3,
        borderColor: isMidnight ? "#312231" : "#ffffff",
        hoverOffset: 8
      }]
    },

    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: isMidnight ? "#f1dce7" : "#79556a",
            usePointStyle: true,
            padding: 18,
            font: {
              family: "DM Sans"
            }
          }
        }
      }
    }
  });
}

// ======================================
// 🫙 SAVINGS JARS
// ======================================

let jars = JSON.parse(
  localStorage.getItem("pinkyJars") || "[]"
);

function saveJars() {
  localStorage.setItem(
    "pinkyJars",
    JSON.stringify(jars)
  );
}

function renderJars() {
  const list = document.getElementById("jarList");
  list.innerHTML = "";

  if (jars.length === 0) {
    list.textContent =
      "Your little dreams are waiting here ♡";
    return;
  }

  jars.forEach((jar, index) => {
    const percentage = Math.min(
      jar.saved / jar.target * 100, 100
    );

    const card = document.createElement("div");
    card.className = "jar-card";

    const header = document.createElement("div");
    header.className = "jar-header";

    const name = document.createElement("h4");
    name.textContent = "🫙 " + jar.name;

    const emoji = document.createElement("span");
    emoji.className = "jar-emoji";
    emoji.textContent =
      percentage >= 100 ? "🎉" : "🎀";

    header.append(name, emoji);

    const progress = document.createElement("div");
    progress.className = "jar-progress";

    const fill = document.createElement("div");
    fill.className = "jar-fill";
    fill.style.width = percentage + "%";

    progress.append(fill);

    const details = document.createElement("div");
    details.className = "jar-details";

    const saved = document.createElement("span");
    saved.textContent =
      "Rs. " + jar.saved.toFixed(2);

    const target = document.createElement("span");
    target.textContent =
      "Goal: Rs. " + jar.target.toFixed(2);

    details.append(saved, target);

    const percentageText = document.createElement("p");
    percentageText.className = "muted";
    percentageText.textContent =
      percentage.toFixed(1) + "% completed ♡";

    const actions = document.createElement("div");
    actions.className = "jar-actions";

    const deposit = document.createElement("button");
    deposit.textContent = "+ Add savings";

    deposit.addEventListener("click", () => {
      const input = prompt(
        "How much would you like to save? (Rs.)"
      );

      if (input === null) return;

      const amount = Number(input);

      if (!Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid amount 💗");
        return;
      }

      jar.saved += amount;
      saveJars();
      renderJars();
    });

    const remove = document.createElement("button");
    remove.className = "delete";
    remove.textContent = "Delete";

    remove.addEventListener("click", () => {
      if (confirm("Delete this savings jar?")) {
        jars.splice(index, 1);
        saveJars();
        renderJars();
      }
    });

    actions.append(deposit, remove);

    card.append(
      header,
      progress,
      details,
      percentageText,
      actions
    );

    list.append(card);
  });
}

// Create savings jar
document.getElementById("jarForm")
  .addEventListener("submit", function(event) {
    event.preventDefault();

    const name =
      document.getElementById("jarName").value.trim();

    const target =
      Number(document.getElementById("jarTarget").value);

    const deposit =
      Number(document.getElementById("jarDeposit").value);

    if (
      !name ||
      !Number.isFinite(target) ||
      !Number.isFinite(deposit) ||
      target <= 0 ||
      deposit <= 0
    ) {
      alert("Please enter valid savings details 🎀");
      return;
    }

    jars.push({
      name,
      target,
      saved: deposit
    });

    saveJars();
    renderJars();
    this.reset();
  });

// ======================================
// 🌙 DAYTIME PINK / MIDNIGHT ROSE
// ======================================

const themeToggle =
  document.getElementById("themeToggle");

function applyTheme(theme) {
  const isMidnight = theme === "midnight";

  document.body.classList.toggle(
    "midnight-theme",
    isMidnight
  );

  themeToggle.textContent = isMidnight
    ? "☀️ Daytime Pink"
    : "🌙 Midnight Rose";

  themeToggle.setAttribute(
    "aria-label",
    isMidnight
      ? "Switch to Daytime Pink theme"
      : "Switch to Midnight Rose theme"
  );

  if (chart) {
    chart.data.datasets[0].borderColor =
      isMidnight ? "#312231" : "#ffffff";

    chart.options.plugins.legend.labels.color =
      isMidnight ? "#f1dce7" : "#79556a";

    chart.update();
  }
}

const savedTheme =
  localStorage.getItem("pinkyTheme") || "day";

applyTheme(
  savedTheme === "midnight" ? "midnight" : "day"
);

themeToggle.addEventListener("click", () => {
  const newTheme =
    document.body.classList.contains("midnight-theme")
      ? "day"
      : "midnight";

  localStorage.setItem("pinkyTheme", newTheme);
  applyTheme(newTheme);
});

// ======================================
// 💌 PROFILE CUSTOMIZATION
// ======================================

const profileOpen =
  document.getElementById("profileOpen");

const profileClose =
  document.getElementById("profileClose");

const profileOverlay =
  document.getElementById("profileOverlay");

const profileForm =
  document.getElementById("profileForm");

const defaultProfile = {
  name: "lovely",
  message: "Let's make your money dreams happen.",
  avatar: "🎀",
  accent: "#df8eaf"
};

const allowedColors = [
  "#df8eaf",
  "#d47ba5",
  "#e8a0bd",
  "#c58bbd",
  "#e5a28f"
];

const allowedAvatars = [
  "🎀", "🧸", "🐰", "🌷",
  "🦢", "🩰", "🧁", "🦋"
];

let profile;

try {
  profile = JSON.parse(
    localStorage.getItem("pinkyProfile") || "null"
  );
} catch {
  profile = null;
}

profile = {
  ...defaultProfile,
  ...(profile && typeof profile === "object" ? profile : {})
};

// Apply profile settings
function applyProfile() {
  document.getElementById("greetingName").textContent =
    profile.name;

  document.getElementById("welcomeMessage").textContent =
    profile.message;

  profileOpen.textContent = profile.avatar;

  document.documentElement.style.setProperty(
    "--profile-accent",
    profile.accent
  );

  document.getElementById("profileName").value =
    profile.name === "lovely" ? "" : profile.name;

  document.getElementById("profileMessage").value =
    profile.message === defaultProfile.message
      ? ""
      : profile.message;

  document.getElementById("profileAvatar").value =
    profile.avatar;

  const selectedColor = document.querySelector(
    `input[name="accent"][value="${profile.accent}"]`
  );

  if (selectedColor) {
    selectedColor.checked = true;
  } else {
    document.querySelectorAll(
      'input[name="accent"]'
    ).forEach(input => {
      input.checked = input.value === defaultProfile.accent;
    });
  }
}

// Open profile
profileOpen.addEventListener("click", () => {
  profileOverlay.classList.add("show");
  document.getElementById("profileName").focus();
});

// Close profile
function closeProfile() {
  profileOverlay.classList.remove("show");
}

profileClose.addEventListener("click", closeProfile);

// Close on outside click
profileOverlay.addEventListener("click", event => {
  if (event.target === profileOverlay) {
    closeProfile();
  }
});

// Close with Escape
document.addEventListener("keydown", event => {
  if (
    event.key === "Escape" &&
    profileOverlay.classList.contains("show")
  ) {
    closeProfile();
  }
});

// Save profile

// Save profile 🎀
profileForm.addEventListener("submit", function(event) {
  event.preventDefault();

  console.log("Profile save clicked!");

  const name = document.getElementById("profileName").value.trim();
  const message = document.getElementById("profileMessage").value.trim();
  const avatar = document.getElementById("profileAvatar").value;

  const selectedColor = document.querySelector(
    'input[name="accent"]:checked'
  );

  const accent = selectedColor
    ? selectedColor.value
    : defaultProfile.accent;

  profile = {
    name: name || defaultProfile.name,
    message: message || defaultProfile.message,
    avatar: allowedAvatars.includes(avatar)
      ? avatar
      : defaultProfile.avatar,
    accent: allowedColors.includes(accent)
      ? accent
      : defaultProfile.accent
  };

  try {
    localStorage.setItem(
      "pinkyProfile",
      JSON.stringify(profile)
    );

    applyProfile();
    closeProfile();

    alert("Your little profile has been saved! 🎀");
  } catch (error) {
    console.error("Profile saving failed:", error);
    alert("Oops! Your profile couldn't be saved.");
  }
});

// ======================================
// ✨ INITIALIZE PINKY WALLET
// ======================================

updateDashboard();
renderJars();
applyProfile();
