async function loadCategories() {
    try {
      const container = document.querySelector(".category-container");

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

        categoryDiv.onclick = () => {
          window.location.href = `components/subcategory.html?categoryID=${category.id}`;
        };

        const name = document.createElement("p");
        name.textContent = category.name;

        categoryDiv.appendChild(name);
        container.appendChild(categoryDiv);
      });

    } catch (error) {
      console.error("Error al cargar las categorías:", error);
    }
  }

  document.addEventListener("DOMContentLoaded", loadCategories);