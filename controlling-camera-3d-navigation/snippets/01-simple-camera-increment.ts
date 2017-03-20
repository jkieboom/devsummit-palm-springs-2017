import esri = __esri;

// esri
import Map = require("esri/Map");

// esri.views
import SceneView = require("esri/views/SceneView");

import * as log from "./support/log";
import { createOverviewMap, createFullscreen } from "./support/widgets";

let view: SceneView;

export function initialize() {
  view = new SceneView({
    container: "viewDiv",

    map: new Map({
      basemap: "hybrid",
      ground: "world-elevation"
    }),

    qualityProfile: "high",

    environment: {
      atmosphere: {
        quality: "high"
      },

      lighting: {
        directShadowsEnabled: true,
        ambientOcclusionEnabled: true
      }
    },

    camera: {
      position: [8.632, 46.522, 7000],
      heading: 25,
      tilt: 75
    },

    ui: {
      components: ["compass", "attribution"]
    } as any
  });

  const overview = createOverviewMap(view);

  createFullscreen(view);

  function padLeft(s: string, n: number) {
    if (s.length < n) {
      return new Array(n - s.length + 1).join(" ") + s;
    }
    else {
      return s;
    }
  }

  view.watch("camera", (camera: esri.Camera) => {
    const heading = camera.heading.toFixed(1).toString();
    const tilt = camera.tilt.toFixed(1).toString();
    const z = camera.position.z.toFixed(0).toString();

    log.message(`Heading: ${padLeft(heading, 5)}, tilt: ${padLeft(tilt, 5)}, z: ${padLeft(z, 5)}`);

    overview.view.rotation = 360 - camera.heading;
  });

  window["view"] = view;
}

export function play(argument?: string) {
  const camera = view.camera.clone();

  switch (argument) {
    case "heading":
      camera.heading += 10;
      break;
    case "tilt":
      camera.tilt -= 5;
      break;
    case "z":
      camera.position.z += 100;
      break;
  }

  view.camera = camera;
}
