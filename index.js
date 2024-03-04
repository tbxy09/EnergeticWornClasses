const express = require("express");
const axios = require("axios");
const path = require("path");
const { Octokit } = require("@octokit/rest");
const app = express();
const port = 3000;
const cors = require("cors"); // Enable CORS if needed

// View engine setup
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

app.use(cors()); // Enable CORS if needed
// API Route
app.get("/search", async (req, res) => {
  // return if is empty
  console.log(req.query.q);
  if (!req.query.q) {
    return res.status(400).send("Please provide a search query.");
  }
  console.log("Searching for repositories...");
  const searchQuery = req.query.q;
  const page = req.query.page || 1;
  const pageSize = req.query.per_page || 10;

  try {
    const response = await axios.get(
      "https://api.github.com/search/repositories",
      {
        params: {
          q: searchQuery,
          sort: "stars",
          order: "desc",
          page,
          per_page: pageSize,
        },
      },
    );
    console.log(response.data.items);
    res.json({
      repos: response.data.items,
      searchQuery,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.render("index", {
      repos: [],
      error: "Error fetching repositories",
    });
  }
});

// ...other imports

// ... your existing routes

// Trending repositories route
app.get("/hello", async (req, res) => {
  console.log("helloworld");
  // res render a page of hellword
  res.json({
    message: "Hello, world!",
  });
});

app.get("/trending", async (req, res) => {
  console.log("Fetching trending repositories...");
  const period = req.query.period || "day"; // Default to daily

  const VALID_PERIODS = ["day", "week", "month"];
  if (!VALID_PERIODS.includes(period)) {
    return res
      .status(400)
      .json({ error: "Invalid period. Use day, week, or month." });
  }

  const octokit = new Octokit(); // Authenticate if needed

  try {
    const response = await octokit.rest.search.repos({
      q: `created:>${getFormattedDate(period)}`,
      sort: "stars",
      order: "desc",
    });

    res.json(response.data.items);
  } catch (error) {
    console.error("Error fetching trending:", error);
    res.status(500).json({ error: "Error fetching trending repositories" });
  }
});

function getFormattedDate(period) {
  const date = new Date();
  date.setDate(date.getDate() - getDaysForPeriod(period));
  return date.toISOString().split("T")[0]; // YYYY-MM-DD format
}

function getDaysForPeriod(period) {
  switch (period) {
    case "week":
      return 7;
    case "month":
      return 30;
    default:
      return 1;
  }
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
