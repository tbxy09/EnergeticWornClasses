const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resultsContainer = document.getElementById("results");
const fetchTrendingBtn = document.getElementById("fetchTrendingBtn");
const trendingPeriod = document.getElementById("trendingPeriod");

searchBtn.addEventListener("click", searchRepositories);
// fetchTrendingBtn.addEventListener("click", fetchTrendingRepositories);

fetchTrendingBtn.addEventListener("click", () => {
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
    const response = await axios.get(
      "https://3eb08793-7282-45f4-a54b-a1dd2ec4d7ee-00-6l5w4ftr49t3.janeway.replit.dev/search",
      {
        // Adjust if your server runs on a different port
        params: {
          q: searchInput,
          page: currentPage,
          per_page: pageSize,
        },
      },
    );
    renderResults(response.data.repos);
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
