async function loadContent() {
    console.log('Loading content...');
    
    try {
        // Esperar a que el contenedor exista
        const container = await waitForSliderContainer();
        
        // Limpiar contenido previo
        container.innerHTML = '';

        // Cargar contenido desde la API con reintentos
        const data = await fetchContentWithRetry();
        
        if (!data || data.length === 0) {
            console.warn('No content data loaded');
            return;
        }

        // Procesar cada grupo de contenido
        data.forEach(group => {
            if (group.contents && Array.isArray(group.contents)) {
                group.contents.forEach(content => {
                    try {
                        const slideDiv = document.createElement("div");
                        slideDiv.classList.add("slide");

                        const imageDiv = document.createElement("div");
                        imageDiv.classList.add("slide-image");
                        
                        // Validar que existe la imagen antes de asignarla
                        if (content.img) {
                            imageDiv.style.backgroundImage = `url('https://wayfindingcms.oohrd.com${content.img}')`;
                        }

                        const colorDiv = document.createElement("div");
                        colorDiv.classList.add("slide-color");

                        slideDiv.appendChild(imageDiv);
                        slideDiv.appendChild(colorDiv);

                        container.appendChild(slideDiv);
                    } catch (itemError) {
                        console.error('Error processing content item:', itemError, content);
                    }
                });
            }
        });

        console.log('Content loaded successfully');

    } catch (error) {
        console.error("Error al cargar el contenido:", error);
        
        // Fallback: mostrar mensaje de error en el contenedor
        const container = document.querySelector(".slider-container");
        if (container) {
            container.innerHTML = '<div class="error-message">Error al cargar el contenido</div>';
        }
        
        throw error; // Re-lanzar para que el sistema de reintentos funcione
    }
}

// Función para esperar a que el contenedor del slider exista
function waitForSliderContainer(timeout = 5000) {
    return new Promise((resolve, reject) => {
        const container = document.querySelector(".slider-container");
        if (container) {
            resolve(container);
            return;
        }

        const observer = new MutationObserver((mutations, obs) => {
            const container = document.querySelector(".slider-container");
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
            reject(new Error(`Slider container not found within ${timeout}ms`));
        }, timeout);
    });
}

// Función para obtener contenido con reintentos
async function fetchContentWithRetry(maxRetries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Fetching content (attempt ${attempt}/${maxRetries})`);
            
            const response = await fetch('https://wayfindingcms.oohrd.com/struct/api/content', {
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
            console.log('Content fetched successfully:', data.length);
            return data;

        } catch (error) {
            console.warn(`Attempt ${attempt} failed:`, error.message);
            
            if (attempt === maxRetries) {
                console.error('All attempts failed to fetch content');
                return [];
            }
            
            await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
    }
}

// Event listener mejorado con manejo de errores
document.addEventListener("DOMContentLoaded", async () => {
    try {
        await loadContent();
    } catch (error) {
        console.error('Failed to load content on DOMContentLoaded:', error);
    }
});