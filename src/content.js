export async function loadContent(typeId) {
    console.log("loadContent llamado con typeId:", typeId);
    
    try {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const container = document.querySelector(".content-container");
        console.log("Container content encontrado:", container);

        if (!container) {
            console.error("Error: Contenedor de contenido no encontrado.");
            return;
        }

        // Ocultar el slider cuando estamos en content
        const sliderContainer = document.querySelector(".slider-container");
        if (sliderContainer) {
            sliderContainer.style.display = "none";
            console.log("Slider ocultado");
        }

        console.log("Haciendo petición a la API de content...");
        const response = await fetch('https://wayfindingcms.oohrd.com/struct/api/content', {
            method: 'GET',
            headers: {
                "Authorization": "Basic " + btoa("andres.carrillo@oohrd.com:andr3sCa11ill0")
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Datos recibidos:", data);

        container.innerHTML = '';

        let filteredData = data;
        if (typeId && typeId !== 'all') {
            const typeIdParsed = parseInt(typeId);
            filteredData = data.filter(group => 
                group.id === typeIdParsed
            );
            console.log(`Contenido filtrado por typeId "${typeId}":`, filteredData);
        }

        if (filteredData.length === 0) {
            container.innerHTML = '<div class="no-data">No hay contenido disponible para esta sección</div>';
            return;
        }

        let totalContent = 0;
        filteredData.forEach(group => {
            if (group.contents && Array.isArray(group.contents)) {
                group.contents.forEach((content, index) => {
                    console.log(`Creando contenido ${totalContent + 1}:`, content);
                    
                    const contentDiv = document.createElement("div");
                    contentDiv.classList.add("content");

                    if (content.img) {
                        contentDiv.style.backgroundImage = `url('https://wayfindingcms.oohrd.com/${content.img}')`;
                    }

                    container.appendChild(contentDiv);
                    totalContent++;
                });
            }
        });

        console.log(`${totalContent} elementos de contenido renderizados exitosamente`);

    } catch (error) {
        console.error("Error al cargar el contenido:", error);
        const container = document.querySelector(".content-container");
        if (container) {
            container.innerHTML = '<div class="error">Error al cargar el contenido</div>';
        }
    }
}

export async function showSlider() {
    const sliderContainer = document.querySelector(".slider-container");
    if (sliderContainer) {
        sliderContainer.style.display = "flex";
    }

    const response = await fetch('https://wayfindingcms.oohrd.com/struct/api/content', {
      method: 'GET',
      headers: {
        "Authorization": "Basic " + btoa("andres.carrillo@oohrd.com:andr3sCa11ill0")
      }
    });

    const data = await response.json();

    sliderContainer.innerHTML = '';

     data.forEach(group => {
      group.contents.forEach(content => {
        const slideDiv = document.createElement("div");
        slideDiv.classList.add("slide");

        const imageDiv = document.createElement("div");
        imageDiv.classList.add("slide-image");
        imageDiv.style.backgroundImage = `url('https://wayfindingcms.oohrd.com${content.img}')`;

        const colorDiv = document.createElement("div");
        colorDiv.classList.add("slide-color");

        slideDiv.appendChild(imageDiv);
        slideDiv.appendChild(colorDiv);

        sliderContainer.appendChild(slideDiv);
      });
    });
}