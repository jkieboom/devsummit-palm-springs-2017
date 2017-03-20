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
        ambientOcclusionEnabled: true,
        date: new Date("Wed Mar 15 2017 21:00:00 GMT+0100 (CET)")
      }
    },

    camera: {
      position: [-75.066, 38.444, 358.45],
      heading: 138.17,
      tilt: 74.11
    },

    ui: {
      components: ["compass", "attribution"]
    } as any
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
  const layer = view.map.layers.getItemAt(0) as FeatureLayer;

  const query = new Query({
    where: "ELEVATION > 90",
    returnGeometry: false,
    geometry: view.extent.clone(),
    outFields: [layer.objectIdField]
  });

  const layerView = view.layerViews.find(layerView => layerView.layer === layer) as esri.FeatureLayerView;

  layer.queryFeatures(query)
      .then((featureSet: esri.FeatureSet) => {
        const objectIds = featureSet.features.map(feature => feature.attributes[layer.objectIdField]);

        const query = new Query({
          objectIds
        });

        return layerView.queryFeatures(query);
      })
      .then((graphics: esri.Graphic[]) => {
        return view.goTo(graphics, { speedFactor: 0.2 });
      })
      .otherwise((err: any) => {
        console.error(err)
      });
}
