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

  window["view"] = view;
}
