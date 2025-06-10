document.addEventListener("DOMContentLoaded", async function () {
    await iniciarSubcategorias();
});

async function iniciarSubcategorias() {
    try {
        let response = await fetch('https://wayfindingcms.oohrd.com/struct/api/category', {
            method: 'GET',
            headers: {
                "Authorization": "Basic " + btoa("andres.carrillo@oohrd.com:andr3sCa11ill0")
            }
        });

        let data = await response.json();
        console.log("Datos recibidos:", data);

        const params = new URLSearchParams(window.location.search);
        const categoryID = parseInt(params.get("categoryID"));

        const containerSubcategorias = document.querySelector(".subcategory-container");

        if (!containerSubcategorias) {
            console.error("Error: Contenedor de subcategorías no encontrado.");
            return;
        }

        const categoriaSeleccionada = data.find(cat => cat.id === categoryID);
        console.log("Categoría seleccionada:", categoriaSeleccionada);

        if (!categoriaSeleccionada || !Array.isArray(categoriaSeleccionada.subCategory)) {
            console.error("Error: Categoría inválida o sin subcategorías. ID:", categoryID);
            return;
        }

        containerSubcategorias.innerHTML = "";

        categoriaSeleccionada.subCategory.forEach(sub => {
            const subDiv = document.createElement("div");
            subDiv.classList.add("subcategory");

            subDiv.innerHTML = `
                <img src=https://wayfindingcms.oohrd.com/${sub.img} width="50" height="50">
                <div class="subcategory-text">${sub.name}</div>
            `;

            subDiv.onclick = () => {
            window.location.href = `./poi.html?subcategoryID=${sub.id}`;
            };

            containerSubcategorias.appendChild(subDiv);
        });

    } catch (error) {
        console.error("Error al cargar subcategorías:", error);
    }
}
