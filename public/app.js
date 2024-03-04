// const { response } = require("express");
currentPage = 1;
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resultsContainer = document.getElementById("results");
const fetchTrendingBtn = document.getElementById("fetchTrendingBtn");
const trendingPeriod = document.getElementById("trendingPeriod");
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
prevBtn.addEventListener('click', () => { currentPage--; searchRepositories(); });
nextBtn.addEventListener('click', () => { currentPage++; searchRepositories(); });
searchBtn.addEventListener("click", searchRepositories);
// fetchTrendingBtn.addEventListener("click", fetchTrendingRepositories);

fetchTrendingBtn.addEventListener("click", () => {
  console.log(trendingPeriod.value);
  const period = trendingPeriod.value;
  fetch(`/trending?period=${period}`)
    .then((response) => response.json())
    .then((data) => {
      // Update the "results" section to display trending repos
    })
    .catch((error) => console.error("Error fetching trending:", error));
});

async function searchRepositories() {
  // ...
  console.log(searchInput.value);
  try {
    // compose the query string, page display
    const query = searchInput.value;
    const page = currentPage;
    const page_size = 20;
    response = await fetch(`/search?q=${query}&page=${page}&page_size=${page_size}`);
    data = await response.json();
    renderResults(data.repos);
    // ... rest of your handling logic
  } catch (error) {
    console.error("Error fetching data:", error);
    // ...
  }
}

function renderResults(repos, source) {
  resultsContainer.innerHTML = ""; // Clear previous results

  if (repos.length === 0) {
    resultsContainer.innerHTML = "<p>No repositories found.</p>";
    return;
  }

  const list = document.createElement("ul");
  repos.forEach((repo) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
            <a href="${repo.html_url}" target="_blank">${repo.name}</a> 
            (${repo.stargazers_count} stars)
        `;
    list.appendChild(listItem);
  });

  resultsContainer.appendChild(list);
}

function renderError(message) {
  resultsContainer.innerHTML = `<p class="error">${message}</p>`;
}
