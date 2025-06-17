export async function loadCategories() {
    console.log('Loading categories...');
    
    try {
        // Esperar a que el contenedor exista
        const container = await waitForCategoryContainer();
        
        // Limpiar contenido previo
        container.innerHTML = '';

        // Cargar categorías desde la API con reintentos
        const data = await fetchCategoriesWithRetry();
        
        if (!data || data.length === 0) {
            console.warn('No categories data loaded');
            return;
        }

        // Procesar cada categoría
        data.forEach(category => {
            try {
                const categoryDiv = document.createElement("div");
                categoryDiv.classList.add("category");

                // Validar que existe la imagen antes de asignarla
                if (category.img) {
                    categoryDiv.style.backgroundImage = `url('https://wayfindingcms.oohrd.com/${category.img}')`;
                }

                categoryDiv.setAttribute('hx-get', `/components/subcategory.html?categoryID=${category.id}`);
                categoryDiv.setAttribute('hx-target', '#main-content');
                categoryDiv.setAttribute('hx-swap', 'innerHTML');

                const name = document.createElement("p");
                name.textContent = category.name || 'Sin nombre';

                categoryDiv.appendChild(name);
                container.appendChild(categoryDiv);

                // Procesar elementos HTMX
                if (typeof htmx !== 'undefined') {
                    htmx.process(categoryDiv);
                }
            } catch (itemError) {
                console.error('Error processing category item:', itemError, category);
            }
        });

        console.log('Categories loaded successfully');

    } catch (error) {
        console.error("Error al cargar las categorías:", error);
        
        // Fallback: mostrar mensaje de error en el contenedor
        const container = document.querySelector(".category-container");
        if (container) {
            container.innerHTML = '<div class="error-message">Error al cargar las categorías</div>';
        }
        
        throw error; // Re-lanzar para que el sistema de reintentos funcione
    }
}

// Función para esperar a que el contenedor de categorías exista
function waitForCategoryContainer(timeout = 5000) {
    return new Promise((resolve, reject) => {
        const container = document.querySelector(".category-container");
        if (container) {
            resolve(container);
            return;
        }

        const observer = new MutationObserver((mutations, obs) => {
            const container = document.querySelector(".category-container");
            if (container) {
                obs.disconnect();
                resolve(container);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Category container not found within ${timeout}ms`));
        }, timeout);
    });
}

// Función para obtener categorías con reintentos
async function fetchCategoriesWithRetry(maxRetries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Fetching categories (attempt ${attempt}/${maxRetries})`);
            
            const response = await fetch('https://wayfindingcms.oohrd.com/struct/api/category', {
                method: 'GET',
                headers: {
                    "Authorization": "Basic " + btoa("andres.carrillo@oohrd.com:andr3sCa11ill0"),
                    "Content-Type": "application/json"
                },
                // Añadir timeout
                signal: AbortSignal.timeout(10000) // 10 segundos timeout
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Categories fetched successfully:', data.length);
            return data;

        } catch (error) {
            console.warn(`Attempt ${attempt} failed:`, error.message);
            
            if (attempt === maxRetries) {
                console.error('All attempts failed to fetch categories');
                return [];
            }
            
            await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
    }
}