document.addEventListener("DOMContentLoaded", async function () {
    await iniciarPOI();
});

async function iniciarPOI() {
    try {
        let response = await fetch('https://wayfindingcms.oohrd.com/struct/api/category', {
            method: 'GET',
            headers: {
                "Authorization": "Basic " + btoa("andres.carrillo@oohrd.com:andr3sCa11ill0")
            }
        });

        let data = await response.json();
        console.log("Datos recibidos:", data);

        // Obtener el poiID de la URL
        const params = new URLSearchParams(window.location.search);
        const subCategoryID = parseInt(params.get("subcategoryID"));

        const containerPOI = document.querySelector(".poi-container");
        let subCategoriaEncontrada = null;

        for (const categoria of data) {
            const subCategoria = categoria.subCategory.find(sub => sub.id === subCategoryID);
            if (subCategoria) {
                subCategoriaEncontrada = subCategoria;
                break;
            }
        }

        if (!subCategoriaEncontrada) {
            console.error("Error: No se encontró la subcategoría con ID:", subCategoryID);
            return;
        }

        containerPOI.innerHTML = "";
        const nombreSubCategoria = subCategoriaEncontrada.name;

        subCategoriaEncontrada.poi.sort((a, b) => a.name.localeCompare(b.name));

        subCategoriaEncontrada.poi.forEach(local => {
            const poiDiv = document.createElement("div");
            poiDiv.classList.add("poi");

            poiDiv.innerHTML = `
                <img src=https://wayfindingcms.oohrd.com/${local.logo}>
            `;

            containerPOI.appendChild(poiDiv);

        });

    } catch (error) {
        console.error("Error al cargar puntos de interes:", error);
    }
}
