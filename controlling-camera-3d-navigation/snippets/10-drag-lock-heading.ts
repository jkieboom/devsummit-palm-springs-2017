import esri = __esri;

// esri
import Map = require("esri/Map");

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
      position: [-3.915, 13.529, 10139105.09],
      heading: 23.28,
      tilt: 11.91
    },

    ui: {
      components: ["compass", "attribution"]
    } as any
  });

  // Store on window for debugging
  window["view"] = view;
}

function installDragHandler() {
  let center: esri.Point;
  let screenPoint: { x: number; y: number; };
  let scale: number;
  let camera: esri.Camera;
  let isDragging = false;

  view.on("drag", (event: any) => {
    if (event.native.ctrlKey) {
      return;
    }

    switch (event.action) {
      case "start":
        if (event.native.button !== 0) {
          return;
        }

        isDragging = true;

        center = view.center.clone() as esri.Point;
        screenPoint = { x: event.x, y: event.y };
        scale = view.scale;
        camera = view.camera.clone();

        break;
      case "update":
        if (!isDragging) {
          return;
        }

        const dx = event.x - screenPoint.x;

        const newCenter = center.clone() as esri.Point;
        newCenter.x -= dx * scale / 2000;

        view.goTo({
          center: newCenter,
          scale: scale,
          heading: camera.heading,
          tilt: camera.tilt
        }, { animate: false });

        break;
      case "end":
        if (!isDragging) {
          return;
        }

        isDragging = false;

        break;
    }

    event.stopPropagation();
  });
}

function createWidgets() {
  const overview = createOverviewMap(view);

  createFullscreen(view);
}

export function play() {
}
