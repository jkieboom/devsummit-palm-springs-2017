import esri = __esri;

// esri
import Map = require("esri/Map");

// esri.core
import watchUtils = require("esri/core/watchUtils");

// esri.layers
import FeatureLayer = require("esri/layers/FeatureLayer");

// esri.tasks.support
import Query = require("esri/tasks/support/Query");

// esri.renderers
import UniqueValueRenderer = require("esri/renderers/UniqueValueRenderer");

// esri.symbols
import PolygonSymbol3D = require("esri/symbols/PolygonSymbol3D");
import ExtrudeSymbol3DLayer = require("esri/symbols/ExtrudeSymbol3DLayer");

// esri.views
import SceneView = require("esri/views/SceneView");

import * as log from "./support/log";
import { createOverviewMap, createFullscreen, add as addWidget } from "./support/widgets";
import { padLeft } from "./support/strings";

let view: SceneView;

export function initialize() {
  createView();
  createWidgets();
}

function createView() {
  const layer = createLayer();

  // Create a basic view with a basemap, initial camera position
  // and basic UI components
  view = new SceneView({
    container: "viewDiv",

    map: new Map({
      basemap: "streets-vector",
      ground: "world-elevation",
      layers: [ layer ] as any
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
      position: [-75.052, 38.414, 481.81],
      heading: 235.75,
      tilt: 67.81
    },

    ui: {
      components: ["compass", "attribution"]
    } as any
  });

  view.on("double-click", (event: any) => {
    event.stopPropagation();

    view.hitTest({ x: event.x, y: event. y})
        .then((hitResult: any) => {
          const graphic = (
            hitResult.results[0] &&
            hitResult.results[0].graphic
          );

          if (graphic) {
            log.message(graphic.attributes.ADDRESS);

            view.goTo({
              target: graphic,
              scale: 1200,
              heading: view.camera.heading + 50
            }, { speedFactor: 0.5 });
          }
        });
  });

  // Store on window for debugging
  window["view"] = view;
}

function createLayer() {
  const resSym = new PolygonSymbol3D({
    symbolLayers: [
      new ExtrudeSymbol3DLayer({
        material: {
          color: "#FC921F"
        }
      })
    ] as any
  });

  const condoSym = new PolygonSymbol3D({
    symbolLayers: [
      new ExtrudeSymbol3DLayer({
        material: {
          color: "#333"
        }
      })
    ] as any
  });

  const renderer = new UniqueValueRenderer({
    defaultSymbol: new PolygonSymbol3D({
      symbolLayers: [
        new ExtrudeSymbol3DLayer({
          material: {
            color: "#A7C636"
          }
        })
      ] as any
    }),

    defaultLabel: "Other",
    field: "DESCLU",

    uniqueValueInfos: [
      {
        value: "Residential",
        symbol: resSym,
        label: "Residential"
      }, {
        value: "Residential Condominium",
        symbol: condoSym,
        label: "Condominium"
      }
    ],

    visualVariables: [
      {
        type: "size",
        field: "ELEVATION",
        valueUnit: "feet" // Converts and extrudes all data values in feet
      }
    ]
  });

  return new FeatureLayer({
    url: "https://services1.arcgis.com/jjVcwHv9AQEq3DH3/ArcGIS/rest/services/Buildings/FeatureServer/0",

    renderer: renderer,

    popupTemplate: {
      title: "{DESCLU}",
      content: [{
        type: "fields",
        fieldInfos: [{
          fieldName: "ADDRESS",
          label: "Address"
        }, {
          fieldName: "DESCLU",
          label: "Type"
        }, {
          fieldName: "ELEVATION",
          label: "Height"
        }]
      }]
    },

    outFields: ["ADDRESS", "DESCLU", "ELEVATION"],

    definitionExpression: "ELEVATION > 0", // show only buildings with height
  });
}

function createWidgets() {
  const overview = createOverviewMap(view);

  createFullscreen(view);
}

export function play() {
}
