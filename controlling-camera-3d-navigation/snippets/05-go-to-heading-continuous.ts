import esri = __esri;

// esri
import Map = require("esri/Map");

// esri.core
import watchUtils = require("esri/core/watchUtils");

// esri.views
import SceneView = require("esri/views/SceneView");

import * as log from "./support/log";
import { createOverviewMap, createFullscreen, add as addWidget } from "./support/widgets";
import { padLeft } from "./support/strings";

let view: SceneView;

// State
let isLookAround = false;
let isStableRotation = true;
let animationFrameHandler = 0;

// Center, scale and position to use for animation
let animationCenter: esri.Point;
let animationScale: number;
let animationPosition: esri.Point;

export function initialize() {
  createView();
  createWidgets();

  view.then(() => {
    // Watch whenever the view goes from !stationary to stationary
    // (e.g. user stops interacting) and update the animation origin
    // from the new viewpoint
    watchUtils.when(view, "stationary", () => {
      updateAnimationOrigin();
    });
  });
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
      position: [8.632, 46.522, 7000],
      heading: 25,
      tilt: 75
    },

    ui: {
      components: ["compass", "attribution"]
    } as any
  });

  // Store on window for debugging
  window["view"] = view;
}

function createWidgets() {
  const overview = createOverviewMap(view);

  createFullscreen(view);

  // Widget to turn on/off stable rotation
  addWidget(view, `<div><input type="checkbox" checked> Stable rotation</div>`, {
    click(event: any) {
      isStableRotation = !!event.target.checked;
    }
  });

  // Widget to turn on/off look around
  addWidget(view, `<div><input type="checkbox"> Enable look around</div>`, {
    click(event: any) {
      // Update the animation origin when we switch to use the current viewpoint
      updateAnimationOrigin();
      isLookAround = !!event.target.checked;
    }
  });

  view.then(() => {
    view.watch("camera", (camera: esri.Camera) => {
      // Show heading tilt in log
      const heading = camera.heading.toFixed(1).toString();
      const tilt = camera.tilt.toFixed(1).toString();

      log.message(`Heading: ${padLeft(heading, 5)}, tilt: ${padLeft(tilt, 5)}`);

      // Synchronize rotation of the overview map with the SceneView
      overview.view.rotation = 360 - camera.heading;
    });
  });
}

function updateAnimationOrigin() {
  animationScale = view.scale;
  animationCenter = view.center.clone() as esri.Point;
  animationPosition = view.camera.position.clone() as esri.Point;
}

function animateLookAroundStep() {
  if (isStableRotation) {
    view.goTo({
      position: animationPosition,
      heading: view.camera.heading - 0.1
    }, { animate: false });
  }
  else {
    view.goTo({
      heading: view.camera.heading - 0.1
    }, { animate: false });
  }
}

function animateRotateAroundStep() {
  if (isStableRotation) {
    view.goTo({
      center: animationCenter,
      scale: animationScale,
      heading: view.camera.heading + 0.1
    }, { animate: false });
  }
  else {
    view.goTo({
      center: view.center,
      heading: view.camera.heading + 0.1
    }, { animate: false });
  }
}

function animate() {
  if (view.stationary) {
    if (isLookAround) {
      animateLookAroundStep();
    }
    else {
      animateRotateAroundStep();
    }
  }

  animationFrameHandler = requestAnimationFrame(animate);
}

export function play(argument?: string) {
  if (animationFrameHandler) {
    cancelAnimationFrame(animationFrameHandler);
    animationFrameHandler = 0;
    return;
  }

  updateAnimationOrigin();
  animate();
}
