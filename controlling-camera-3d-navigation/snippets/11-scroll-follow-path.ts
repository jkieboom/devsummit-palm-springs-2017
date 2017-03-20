import esri = __esri;

// esri
import Map = require("esri/Map");
import Camera = require("esri/Camera");
import Graphic = require("esri/Graphic");

// esri.geometry
import Polyline = require("esri/geometry/Polyline");

// esri.layers
import SceneLayer = require("esri/layers/SceneLayer");

// esri.symbols
import LineSymbol3D = require("esri/symbols/LineSymbol3D");
import LineSymbol3DLayer = require("esri/symbols/LineSymbol3DLayer");

// esri.views
import SceneView = require("esri/views/SceneView");

import * as log from "./support/log";
import { createOverviewMap, createFullscreen, add as addWidget } from "./support/widgets";

let view: SceneView;

export function initialize() {
  createView();
  installDragHandler();
  createWidgets();
}

function createView() {
  // Create a basic view with a basemap, initial camera position
  // and basic UI components
  view = new SceneView({
    container: "viewDiv",

    map: new Map({
      basemap: "hybrid",
      ground: "world-elevation",
      layers: [ new SceneLayer("https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/New_York_LoD2_3D_Buildings/SceneServer") ] as any
    }),

    qualityProfile: "high",

    environment: {
      atmosphere: {
        quality: "high"
      },

      lighting: {
        directShadowsEnabled: true,
        ambientOcclusionEnabled: true,
        date: new Date("Wed Mar 15 2017 21:00:00 GMT+0100 (CET)")
      }
    },

    constraints: {
      collision: {
        enabled: false
      }
    },

    camera: {
      position: [-74.051, 40.600, 219.34],
      heading: 5.34,
      tilt: 86.33
    },

    ui: {
      components: ["compass", "attribution"]
    } as any
  });

  let positions: number[][] = [];

  for (let t = 0; t < totalDuration; t += 0.01) {
    const camera = interpolateCameraAtSmooth(t);
    positions.push([camera.position.x, camera.position.y, camera.position.z - 10]);
  }

  const line = new Polyline({
    paths: [ positions ],
    spatialReference: path.cameras[0].position.spatialReference
  });

  const symbol = new LineSymbol3D({
    symbolLayers: [
      new LineSymbol3DLayer({
        material: {
          color: "rgba(255, 0, 0, 0.5)"
        },

        size: 5
      })
    ] as any
  });

  view.graphics.add(new Graphic({
    geometry: line,
    symbol: symbol
  }));

  // Store on window for debugging
  window["view"] = view;
}

function interpolateNumber(min: number, max: number, factor: number) {
  return min + (max - min) * factor;
}

function interpolateCameraAt(t: number): esri.Camera {
  let previousAccumulatedTime = 0;
  let accumulatedTime = 0;

  t = Math.max(0, Math.min(t, totalDuration))

  for (let i = 0; i < path.cameras.length; i++) {
    if (t < accumulatedTime) {
      // Interpolate between i - 1 and i
      const factor = (t - previousAccumulatedTime) / path.durations[i - 1];
      const previousCamera = Camera.fromJSON(path.cameras[i - 1]);
      const nextCamera = Camera.fromJSON(path.cameras[i]);

      return new Camera({
        heading: interpolateNumber(previousCamera.heading, nextCamera.heading, factor),
        tilt: interpolateNumber(previousCamera.tilt, nextCamera.tilt, factor),

        position: {
          x: interpolateNumber(previousCamera.position.x, nextCamera.position.x, factor),
          y: interpolateNumber(previousCamera.position.y, nextCamera.position.y, factor),
          z: interpolateNumber(previousCamera.position.z, nextCamera.position.z, factor),

          spatialReference: previousCamera.position.spatialReference
        }
      });
    }

    previousAccumulatedTime = accumulatedTime;
    accumulatedTime += path.durations[i];
  }

  return Camera.fromJSON(path.cameras[path.cameras.length - 1]);
}

function interpolateCameraAtSmooth(t: number): esri.Camera {
  const windowSize = 0.2;
  const smoothN = 5;
  const resultCamera = new Camera();
  const totalSize = smoothN * 2 + 1;

  for (let i = -smoothN; i <= smoothN; i++) {
    const camera = interpolateCameraAt(t + i / smoothN * windowSize);

    resultCamera.heading += camera.heading / totalSize;
    resultCamera.tilt += camera.tilt / totalSize;

    resultCamera.position.x += camera.position.x / totalSize;
    resultCamera.position.y += camera.position.y / totalSize;
    resultCamera.position.z += camera.position.z / totalSize;

    resultCamera.position.spatialReference = camera.position.spatialReference;
  }

  return resultCamera;
}

function installDragHandler() {
  let time = 0;

  const timeScale = 0.005;

  view.on("key-down", (event: any) => event.stopPropagation());

  view.on("mouse-wheel", (event: any) => {
    event.stopPropagation();

    const dy = event.deltaY;
    time -= dy * timeScale;

    // Clamp time between min/max
    time = Math.max(0, Math.min(time, totalDuration));

    const camera = interpolateCameraAtSmooth(time);

    view.goTo(camera, { animate: false });
  });
}

function createWidgets() {
  const overview = createOverviewMap(view);

  createFullscreen(view);
}

export function play() {
}

const path = {
  cameras: [{"position":{"x":-8243274.202532292,"y":4953482.989426584,"z":219.34023588802665,"spatialReference":{"latestWkid":3857,"wkid":102100}},"heading":5.335001139253633,"tilt":86.32759832459445},{"position":{"x":-8242609.37958358,"y":4966407.1859692475,"z":15.476993725635111,"spatialReference":{"latestWkid":3857,"wkid":102100}},"heading":2.8960302649627137,"tilt":100.70623526856505},{"position":{"x":-8242852.497541719,"y":4966617.820725553,"z":32.75234307255596,"spatialReference":{"latestWkid":3857,"wkid":102100}},"heading":87.06166810977817,"tilt":93.25630233060741},{"position":{"x":-8242741.841230058,"y":4966652.180975108,"z":55.487207820639014,"spatialReference":{"latestWkid":3857,"wkid":102100}},"heading":57.970276488492296,"tilt":87.44073594158174},{"position":{"x":-8239725.638640405,"y":4969152.945281935,"z":30.416297066025436,"spatialReference":{"latestWkid":3857,"wkid":102100}},"heading":30.22812462509424,"tilt":85.7315940765799},{"position":{"x":-8239521.14008037,"y":4969511.033008745,"z":20.9944504275918,"spatialReference":{"latestWkid":3857,"wkid":102100}},"heading":22.900787311966553,"tilt":85.73329761344144},{"position":{"x":-8239412.978878524,"y":4969859.620834436,"z":30.95245088543743,"spatialReference":{"latestWkid":3857,"wkid":102100}},"heading":84.5277343473028,"tilt":90.22762014430961},{"position":{"x":-8238844.420132888,"y":4969940.091328921,"z":149.23174553364515,"spatialReference":{"latestWkid":3857,"wkid":102100}},"heading":79.4233023912327,"tilt":96.2533383299448},{"position":{"x":-8238686.299104725,"y":4969985.7968038665,"z":237.52135635912418,"spatialReference":{"latestWkid":3857,"wkid":102100}},"heading":77.64761579562486,"tilt":85.16522223765791},{"position":{"x":-8238631.130216863,"y":4970135.097442781,"z":246.11975672934204,"spatialReference":{"latestWkid":3857,"wkid":102100}},"heading":144.27093846760008,"tilt":78.0908921806991},{"position":{"x":-8238240.278541888,"y":4970958.298245056,"z":381.9773144228384,"spatialReference":{"latestWkid":3857,"wkid":102100}},"heading":197.57162827648924,"tilt":77.8939402567012},{"position":{"x":-8235302.526927844,"y":4972121.046480531,"z":1354.9364742534235,"spatialReference":{"latestWkid":3857,"wkid":102100}},"heading":239.1171805686945,"tilt":70.22622748653329},{"position":{"x":-8224024.268694822,"y":4964419.640154784,"z":6999.535141564906,"spatialReference":{"latestWkid":3857,"wkid":102100}},"heading":289.37255118410826,"tilt":60.587836453285135}],
  durations: [2, 1, 1, 2, 1, 1, 1, 1, 1, 5, 5, 5]
};

const totalDuration = path.durations.reduce((a, b) => a + b, 0);
