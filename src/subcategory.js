export async function loadSubcategories(categoryID) {
    console.log("loadSubcategories llamado con ID:", categoryID);
    
    try {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const containerSubcategorias = document.querySelector(".subcategory-container");
        console.log("Container encontrado:", containerSubcategorias);

        if (!containerSubcategorias) {
            console.error("Error: Contenedor de subcategorías no encontrado.");
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

        const categoryIDParsed = parseInt(categoryID);
        console.log("Category ID a buscar:", categoryIDParsed);

        const categoriaSeleccionada = data.find(cat => cat.id === categoryIDParsed);
        console.log("Categoría seleccionada:", categoriaSeleccionada);

        if (!categoriaSeleccionada || !Array.isArray(categoriaSeleccionada.subCategory)) {
            console.error("Error: Categoría inválida o sin subcategorías. ID:", categoryIDParsed);
            console.log("Estructura de categoría:", categoriaSeleccionada);
            containerSubcategorias.innerHTML = '<div class="no-data">No hay subcategorías disponibles</div>';
            return;
        }

        containerSubcategorias.innerHTML = "";
        console.log("Renderizando", categoriaSeleccionada.subCategory.length, "subcategorías...");

        categoriaSeleccionada.subCategory.forEach((sub, index) => {
            console.log(`Creando subcategoría ${index + 1}:`, sub);
            
            const subDiv = document.createElement("div");
            subDiv.classList.add("subcategory");

            subDiv.innerHTML = `
                <img src="https://wayfindingcms.oohrd.com/${sub.img}" width="50" height="50">
                <div class="subcategory-text">${sub.name}</div>
            `;

            subDiv.setAttribute("hx-get", `/components/poi.html?subcategoryID=${sub.id}`);
            subDiv.setAttribute("hx-target", "#main-content");
            subDiv.setAttribute("hx-swap", "innerHTML");
            subDiv.style.cursor = "pointer";

            containerSubcategorias.appendChild(subDiv);
            
            htmx.process(subDiv);
        });

        console.log("Subcategorías renderizadas exitosamente");

    } catch (error) {
        console.error("Error al cargar subcategorías:", error);
        const containerSubcategorias = document.querySelector(".subcategory-container");
        if (containerSubcategorias) {
            containerSubcategorias.innerHTML = '<div class="error">Error al cargar las subcategorías</div>';
        }
    }
}