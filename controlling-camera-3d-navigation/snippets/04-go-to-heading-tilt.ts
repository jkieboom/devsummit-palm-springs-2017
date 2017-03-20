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

    log.message(`Heading: ${padLeft(heading, 5)}, tilt: ${padLeft(tilt, 5)}`);

    overview.view.rotation = 360 - camera.heading;
  });

  window["view"] = view;
}

function playHeading() {
  const currentHeading = view.camera.heading;
  const heading = Math.floor((currentHeading + 1) / 30) * 30 + 30;

  view.goTo({ heading });
}

function playTilt() {
  const currentTilt = view.camera.tilt;

  // Cycle tilt of the view
  const tilt = (Math.floor((currentTilt + 1) / 15) * 15 + 15) % 90;

  // go to tilt preserves view.center
  view.goTo({ tilt });
}

export function play(argument?: string) {
  switch (argument) {
    case "heading":
      playHeading();
      break;
    case "tilt":
      playTilt();
      break;
  }
}
