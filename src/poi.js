export async function loadPois(subcategoryID) {
    console.log("loadPois llamado con ID:", subcategoryID);
    
    try {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const containerPOI = document.querySelector(".poi-container");
        console.log("Container POI encontrado:", containerPOI);

        if (!containerPOI) {
            console.error("Error: Contenedor de POIs no encontrado.");
            console.log("Elementos disponibles:", document.querySelectorAll('*'));
            return;
        }

        console.log("Haciendo petición a la API...");
        let response = await fetch('https://wayfindingcms.oohrd.com/struct/api/category', {
            method: 'GET',
            headers: {
                "Authorization": "Basic " + btoa("andres.carrillo@oohrd.com:andr3sCa11ill0")
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data = await response.json();
        console.log("Datos recibidos:", data);

        const subcategoryIDParsed = parseInt(subcategoryID);
        console.log("Subcategory ID a buscar:", subcategoryIDParsed);

        let subCategoriaEncontrada = null;
        for (const categoria of data) {
            if (categoria.subCategory && Array.isArray(categoria.subCategory)) {
                const subCategoria = categoria.subCategory.find(sub => sub.id === subcategoryIDParsed);
                if (subCategoria) {
                    subCategoriaEncontrada = subCategoria;
                    break;
                }
            }
        }

        if (!subCategoriaEncontrada) {
            console.error("Error: No se encontró la subcategoría con ID:", subcategoryIDParsed);
            containerPOI.innerHTML = '<div class="no-data">No se encontró la subcategoría</div>';
            return;
        }

        if (!subCategoriaEncontrada.poi || !Array.isArray(subCategoriaEncontrada.poi)) {
            console.error("Error: Subcategoría sin POIs válidos");
            containerPOI.innerHTML = '<div class="no-data">No hay puntos de interés disponibles</div>';
            return;
        }

        containerPOI.innerHTML = "";
        console.log("Renderizando", subCategoriaEncontrada.poi.length, "POIs...");

        subCategoriaEncontrada.poi.sort((a, b) => a.name.localeCompare(b.name));

        subCategoriaEncontrada.poi.forEach((local, index) => {
            console.log(`Creando POI ${index + 1}:`, local);
            
            const poiDiv = document.createElement("div");
            poiDiv.classList.add("poi");

            poiDiv.innerHTML = `
                <img src="https://wayfindingcms.oohrd.com/${local.logo}" alt="${local.name}">
            `;

            poiDiv.style.cursor = "pointer";

            containerPOI.appendChild(poiDiv);
        });

        console.log("POIs renderizados exitosamente");

    } catch (error) {
        console.error("Error al cargar POIs:", error);
        const containerPOI = document.querySelector(".poi-container");
        if (containerPOI) {
            containerPOI.innerHTML = '<div class="error">Error al cargar los puntos de interés</div>';
        }
    }
}