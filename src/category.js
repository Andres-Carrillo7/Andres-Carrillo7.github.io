export async function loadCategories() {
  try {
    const container = document.querySelector(".category-container");

    if (!container) return;

    const response = await fetch('https://wayfindingcms.oohrd.com/struct/api/category', {
      method: 'GET',
      headers: {
        "Authorization": "Basic " + btoa("andres.carrillo@oohrd.com:andr3sCa11ill0")
      }
    });

    const data = await response.json();
    container.innerHTML = '';

    data.forEach(category => {
      const categoryDiv = document.createElement("div");
      categoryDiv.classList.add("category");

      categoryDiv.style.backgroundImage = `url('https://wayfindingcms.oohrd.com/${category.img}')`;

      categoryDiv.setAttribute('hx-get', `/components/subcategory.html?categoryID=${category.id}`);
      categoryDiv.setAttribute('hx-target', '#main-content');
      categoryDiv.setAttribute('hx-swap', 'innerHTML');

      const name = document.createElement("p");
      name.textContent = category.name;

      categoryDiv.appendChild(name);
      container.appendChild(categoryDiv);

      htmx.process(categoryDiv);
    });

  } catch (error) {
    console.error("Error al cargar las categorías:", error);
  }
}