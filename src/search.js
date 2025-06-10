let currentController = null;

function filterData(query) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = "";

  if (query.length === 0) {
    resultsContainer.style.display = "none";
    return;
  }

  if (currentController) {
    currentController.abort();
  }

  currentController = new AbortController();
  const signal = currentController.signal;

  fetch("https://wayfindingcms.oohrd.com/struct/api/point", {
    method: "GET",
    headers: {
      "Authorization": "Basic " + btoa("andres.carrillo@oohrd.com:andr3sCa11ill0")
    },
    signal
  })
    .then(response => response.json())
    .then(data => {
      const filteredResults = data.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );

      if (filteredResults.length === 0) {
        const noMatchMessage = document.createElement("div");
        noMatchMessage.classList.add("no-match");
        noMatchMessage.textContent = "No se encontró coincidencia";
        resultsContainer.appendChild(noMatchMessage);
        resultsContainer.style.display = "block";
        return;
      }

      const namesSeen = new Set();
      filteredResults.forEach(item => {
        if (!namesSeen.has(item.name)) {
          namesSeen.add(item.name);

          const resultItem = document.createElement("div");
          resultItem.classList.add("result-item");
          resultItem.innerHTML = `<strong>${item.name}</strong>`;
          resultItem.setAttribute("data-poi-id", item.poiID);

          resultItem.addEventListener("click", () => {
            window.location.href = `components/map.html?poiID=${item.poiID}`;
          });

          resultsContainer.appendChild(resultItem);
        }
      });

      resultsContainer.style.display = "block";
    })
    .catch(error => {
      if (error.name !== "AbortError") {
        console.error("Error al obtener datos desde la API:", error);
      }
    });
}

document.querySelector(".search-input").addEventListener("input", (e) => {
  filterData(e.target.value);
});

document.addEventListener("click", (e) => {
  const searchBox = document.querySelector(".search-container");
  const results = document.getElementById("results");
  if (!searchBox.contains(e.target) && !results.contains(e.target)) {
    results.style.display = "none";
  }
});
