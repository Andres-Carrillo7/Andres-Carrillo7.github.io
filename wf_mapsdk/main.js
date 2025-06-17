import { getMapData, show3dMap, DOORS, WALLS, } from 'https://cdn.jsdelivr.net/npm/@mappedin/mappedin-js@6.0.1-beta.43/lib/esm/index.js';


export class WFMapSDK {
    defaultCameraPosition = {
        bearing: 0,//rotacion
        pitch: 41,  // elevacion
        zoomLevel: 19, //mapView.Camera.zoomLevel,
        //center: mapView.Camera.center,
    };
    minZoom = 17
    maxZoom = 21

    /*
    client={
        map_key: '',
        map_secret: '',
        mapId: ''
    },
    containerId,  zoomInBtnId, zoomOutBtnId, resetBtnId= Dom element id
    */

  
    constructor(client, containerId, zoomInBtnId, zoomOutBtnId, resetBtnId,  options = {}) {
        this.containerEl = document.getElementById(containerId);
        this.zoomInEl= document.getElementById(zoomInBtnId);
        this.zoomOutEl= document.getElementById(zoomOutBtnId);
        this.camResetEl= document.getElementById(resetBtnId);
        this.mapconfig={
            key: client.map_key,
            secret: client.map_secret,
            mapId: client.map_id
        };

        this.options = options;

        if (!this.containerEl) {
            console.error(`No se encontró el contenedor con id: "${containerId}"`);
            return;
        }

        this.init();
    }

    async init() {
        await this.preLoad()
        await this.loadMap()

    }

    preLoad() {
        // carga estilos mappedin
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = `https://cdn.jsdelivr.net/npm/@mappedin/mappedin-js@beta/lib/index.css`;
        document.head.appendChild(link);

        //carga estilos locales
        const linkcss = document.createElement('link');
        linkcss.rel = 'stylesheet';
        linkcss.href = 'wf_mapsdk/style.css';
        document.head.appendChild(linkcss);

        this.zoomInEl.disabled = true;
        this.zoomOutEl.disabled = true;
        this.camResetEl.disabled = true;

        //crea contenedor mapa
        this.containerEl.innerHTML= `
            <div id="mappedin-map"></div>
            <div id="compass-wrapper">
                <div id="compass"></div>
            </div>
        `
        this.containerEl.style.overflow= 'hidden';
        this.mapwrapper= this.containerEl.querySelector('#mappedin-map')
        if(this.containerEl.clientWidth <= 0 || this.containerEl.clientHeight <= 0){
           console.error('sdk: Dimensiones del container debe ser mayor a 0')
        }
        this.compassEl=  document.getElementById('compass')
    }


    async loadMap(){
        this.mapData = await getMapData(this.mapconfig);
        this.mapView = await show3dMap(this.mapwrapper, this.mapData, {
        })
        console.log("sdk: Mapa cargado")

        this.mapView.Camera.setMinZoomLevel(this.minZoom)
        this.mapView.Camera.setMaxZoomLevel(this.maxZoom)

        //controls
        this.mapSetupControls()
        // compass
        this.mapView.on('camera-change', async (cam) => {
            const bearing = Math.floor(cam.bearing)
            //console.log(bearing)
            this.compassEl.style.transform = `rotate(-${bearing}deg)`;
        })

    }

    mapSetupControls(){
        this.zoomInEl.disabled = false;
        this.zoomOutEl.disabled = false;
        this.camResetEl.disabled = false;
        this.zoomInEl.addEventListener("click", () =>{
            const newZoom = this.mapView.Camera.zoomLevel + 0.5
            //console.log(newZoom)
            if (newZoom >= this.maxZoom) {
                this.zoomInEl.disabled = true
            } else {
                this.zoomOutEl.disabled = false
                this.mapView.Camera.animateTo({ zoomLevel: newZoom }, { duration: 200 });
            }
        })
        this.zoomOutEl.addEventListener("click", () =>{
            const newZoom = this.mapView.Camera.zoomLevel - 0.5
            //console.log(newZoom)
            if (newZoom <= this.minZoom) {
                this.zoomOutEl.disabled = true
            } else {
                this.zoomInEl.disabled = false
                this.mapView.Camera.animateTo({ zoomLevel: newZoom }, { duration: 200 });
            }
        })
        this.camResetEl.addEventListener("click", () => {
            this.mapView.Camera.set(this.defaultCameraPosition);
        })
    }

 
}
  
// Exportar globalmente
window.MySDK = WFMapSDK;