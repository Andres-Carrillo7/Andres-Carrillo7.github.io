async function loadContent() {
  try {
    const container = document.querySelector(".slider-container");

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
        const slideDiv = document.createElement("div");
        slideDiv.classList.add("slide");

        const imageDiv = document.createElement("div");
        imageDiv.classList.add("slide-image");
        imageDiv.style.backgroundImage = `url('https://wayfindingcms.oohrd.com${content.img}')`;

        const colorDiv = document.createElement("div");
        colorDiv.classList.add("slide-color");

        slideDiv.appendChild(imageDiv);
        slideDiv.appendChild(colorDiv);

        container.appendChild(slideDiv);
      });
    });

  } catch (error) {
    console.error("Error al cargar las categorías:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadContent);
