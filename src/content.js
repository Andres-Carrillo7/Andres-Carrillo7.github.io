async function loadContent() {
  try {
    const container = document.querySelector(".content-container");

    const response = await fetch('https://wayfindingcms.oohrd.com/struct/api/content', {
      method: 'GET',
      headers: {
        "Authorization": "Basic " + btoa("andres.carrillo@oohrd.com:andr3sCa11ill0")
      }
    });

    const data = await response.json();
    container.innerHTML = '';

    data.forEach(group => {
      group.contents.forEach(content => {
        const contentDiv = document.createElement("div");
        contentDiv.classList.add("content");

        contentDiv.style.backgroundImage = `url('https://wayfindingcms.oohrd.com/${content.img}')`;

        container.appendChild(contentDiv);
      });
    });

  } catch (error) {
    console.error("Error al cargar las categorías:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadContent);
