export async function loadMenu() {
    console.log('Loading menu...');
    
    try {
        // Esperar a que el contenedor exista
        const menuContainer = await waitForMenuContainer();
        
        // Limpiar contenido previo
        menuContainer.innerHTML = '';

        // Agregar ítem del mapa primero (siempre disponible)
        const mapMenuItem = document.createElement("div");
        mapMenuItem.classList.add("menu-item");
        mapMenuItem.innerHTML = `
            <img src="/assets/icon-map.svg" alt="Mapa" class="icon" />
            <a href="#" onclick="showMapFromMenu(); return false;">Mapa</a>
        `;
        menuContainer.appendChild(mapMenuItem);

        // Cargar content types desde la API con reintentos
        const contentTypes = await fetchContentTypesWithRetry();
        
        if (!contentTypes || contentTypes.length === 0) {
            console.warn('No content types loaded, menu will only show map option');
            return;
        }

        const iconMap = {
            'promociones': '/assets/icon-promotion.svg',
            'eventos': '/assets/icon-event.svg', 
            'servicios': '/assets/icon-service.svg'
        };

        // Procesar cada content type
        contentTypes.forEach(contentType => {
            try {
                const menuItem = document.createElement("div");
                menuItem.classList.add("menu-item");

                const iconSrc = iconMap[contentType.menu_name?.toLowerCase()] || '/assets/icon-default.svg';

                menuItem.innerHTML = `
                    <img src="${iconSrc}" alt="${contentType.menu_name || 'Contenido'}" class="icon" />
                    <a href="/components/content.html?typeId=${contentType.id}"
                       hx-get="/components/content.html?typeId=${contentType.id}"
                       hx-target="#main-content"
                       hx-swap="innerHTML">${contentType.menu_name || 'Contenido'}</a>
                `;

                menuContainer.appendChild(menuItem);
                
                // Procesar elementos HTMX
                if (typeof htmx !== 'undefined') {
                    htmx.process(menuItem);
                }
            } catch (itemError) {
                console.error('Error processing menu item:', itemError, contentType);
            }
        });

        console.log('Menu loaded successfully');

    } catch (error) {
        console.error("Error al cargar el menú:", error);
        
        // Fallback: asegurar que al menos el mapa esté disponible
        const menuContainer = document.querySelector(".menu-items");
        if (menuContainer && menuContainer.innerHTML.trim() === '') {
            menuContainer.innerHTML = `
                <div class="menu-item">
                    <img src="/assets/icon-map.svg" alt="Mapa" class="icon" />
                    <a href="#" onclick="showMapFromMenu(); return false;">Mapa</a>
                </div>
            `;
        }
        
        throw error; // Re-lanzar para que el sistema de reintentos funcione
    }
}

// Función para esperar a que el contenedor del menú exista
function waitForMenuContainer(timeout = 5000) {
    return new Promise((resolve, reject) => {
        const container = document.querySelector(".menu-items");
        if (container) {
            resolve(container);
            return;
        }

        const observer = new MutationObserver((mutations, obs) => {
            const container = document.querySelector(".menu-items");
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
            reject(new Error(`Menu container not found within ${timeout}ms`));
        }, timeout);
    });
}

// Función para obtener content types con reintentos
async function fetchContentTypesWithRetry(maxRetries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Fetching content types (attempt ${attempt}/${maxRetries})`);
            
            const response = await fetch('https://wayfindingcms.oohrd.com/struct/api/content_type', {
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

            const contentTypes = await response.json();
            console.log('Content types fetched successfully:', contentTypes.length);
            return contentTypes;

        } catch (error) {
            console.warn(`Attempt ${attempt} failed:`, error.message);
            
            if (attempt === maxRetries) {
                console.error('All attempts failed to fetch content types');
                return [];
            }
            
            await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
    }
}