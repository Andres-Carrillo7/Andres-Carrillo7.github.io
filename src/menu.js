export async function loadMenu() {
    
    try {
        const menuContainer = document.querySelector(".menu-items");
        
        if (!menuContainer) {
            console.error("Error: Contenedor del menú no encontrado.");
            return;
        }

        menuContainer.innerHTML = `
            <div class="menu-item">
                <img src="/assets/icon-map.svg" alt="Mapa" class="icon" />
                <a href="#" onclick="showMapFromMenu(); return false;">Mapa</a>
            </div>
        `;

        const response = await fetch('https://wayfindingcms.oohrd.com/struct/api/content_type', {
            method: 'GET',
            headers: {
                "Authorization": "Basic " + btoa("andres.carrillo@oohrd.com:andr3sCa11ill0")
            }
        });

        const contentTypes = await response.json();

        const iconMap = {
            'promociones': '/assets/icon-promotion.svg',
            'eventos': '/assets/icon-event.svg', 
            'servicios': '/assets/icon-service.svg'
        };

        contentTypes.forEach(contentType => {
            
            const menuItem = document.createElement("div");
            menuItem.classList.add("menu-item");

            const iconSrc = iconMap[contentType.menu_name.toLowerCase()] || '/assets/icon-default.svg';

            menuItem.innerHTML = `
                <img src="${iconSrc}" alt="${contentType.menu_name}" class="icon" />
                <a href="/components/content.html?typeId=${contentType.id}"
                   hx-get="/components/content.html?typeId=${contentType.id}"
                   hx-target="#main-content"
                   hx-swap="innerHTML">${contentType.menu_name}</a>
            `;

            menuContainer.appendChild(menuItem);
            
            htmx.process(menuItem);
        });

    } catch (error) {
        console.error("Error al cargar el menú:", error);
        const menuContainer = document.querySelector(".menu-items");
        if (menuContainer && menuContainer.innerHTML.trim() === '') {
            menuContainer.innerHTML = `
                <div class="menu-item">
                    <img src="/assets/icon-map.svg" alt="Mapa" class="icon" />
                    <a href="#" onclick="showMapFromMenu(); return false;">Mapa</a>
                </div>
            `;
        }
    }
}