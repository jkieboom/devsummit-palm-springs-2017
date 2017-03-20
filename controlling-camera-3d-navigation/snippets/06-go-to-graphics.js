define(["require", "exports", "esri/Map", "esri/layers/FeatureLayer", "esri/tasks/support/Query", "esri/renderers/UniqueValueRenderer", "esri/symbols/PolygonSymbol3D", "esri/symbols/ExtrudeSymbol3DLayer", "esri/views/SceneView", "./support/widgets"], function (require, exports, Map, FeatureLayer, Query, UniqueValueRenderer, PolygonSymbol3D, ExtrudeSymbol3DLayer, SceneView, widgets_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var view;
    function initialize() {
        createView();
        createWidgets();
    }
    exports.initialize = initialize;
    function createView() {
        var layer = createLayer();
        // Create a basic view with a basemap, initial camera position
        // and basic UI components
        view = new SceneView({
            container: "viewDiv",
            map: new Map({
                basemap: "streets-vector",
                ground: "world-elevation",
                layers: [layer]
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
            }
        });
        // Store on window for debugging
        window["view"] = view;
    }
    function createLayer() {
        var resSym = new PolygonSymbol3D({
            symbolLayers: [
                new ExtrudeSymbol3DLayer({
                    material: {
                        color: "#FC921F"
                    }
                })
            ]
        });
        var condoSym = new PolygonSymbol3D({
            symbolLayers: [
                new ExtrudeSymbol3DLayer({
                    material: {
                        color: "#333"
                    }
                })
            ]
        });
        var renderer = new UniqueValueRenderer({
            defaultSymbol: new PolygonSymbol3D({
                symbolLayers: [
                    new ExtrudeSymbol3DLayer({
                        material: {
                            color: "#A7C636"
                        }
                    })
                ]
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
            definitionExpression: "ELEVATION > 0",
        });
    }
    function createWidgets() {
        var overview = widgets_1.createOverviewMap(view);
        widgets_1.createFullscreen(view);
    }
    function play() {
        var layer = view.map.layers.getItemAt(0);
        var query = new Query({
            where: "ELEVATION > 90",
            returnGeometry: false,
            geometry: view.extent.clone(),
            outFields: [layer.objectIdField]
        });
        var layerView = view.layerViews.find(function (layerView) { return layerView.layer === layer; });
        layer.queryFeatures(query)
            .then(function (featureSet) {
            var objectIds = featureSet.features.map(function (feature) { return feature.attributes[layer.objectIdField]; });
            var query = new Query({
                objectIds: objectIds
            });
            return layerView.queryFeatures(query);
        })
            .then(function (graphics) {
            return view.goTo(graphics, { speedFactor: 0.2 });
        })
            .otherwise(function (err) {
            console.error(err);
        });
    }
    exports.play = play;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMDYtZ28tdG8tZ3JhcGhpY3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIwNi1nby10by1ncmFwaGljcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztJQTJCQSxJQUFJLElBQWUsQ0FBQztJQUVwQjtRQUNFLFVBQVUsRUFBRSxDQUFDO1FBQ2IsYUFBYSxFQUFFLENBQUM7SUFDbEIsQ0FBQztJQUhELGdDQUdDO0lBRUQ7UUFDRSxJQUFNLEtBQUssR0FBRyxXQUFXLEVBQUUsQ0FBQztRQUU1Qiw4REFBOEQ7UUFDOUQsMEJBQTBCO1FBQzFCLElBQUksR0FBRyxJQUFJLFNBQVMsQ0FBQztZQUNuQixTQUFTLEVBQUUsU0FBUztZQUVwQixHQUFHLEVBQUUsSUFBSSxHQUFHLENBQUM7Z0JBQ1gsT0FBTyxFQUFFLGdCQUFnQjtnQkFDekIsTUFBTSxFQUFFLGlCQUFpQjtnQkFDekIsTUFBTSxFQUFFLENBQUUsS0FBSyxDQUFTO2FBQ3pCLENBQUM7WUFFRixjQUFjLEVBQUUsTUFBTTtZQUV0QixXQUFXLEVBQUU7Z0JBQ1gsVUFBVSxFQUFFO29CQUNWLE9BQU8sRUFBRSxNQUFNO2lCQUNoQjtnQkFFRCxRQUFRLEVBQUU7b0JBQ1Isb0JBQW9CLEVBQUUsSUFBSTtvQkFDMUIsdUJBQXVCLEVBQUUsSUFBSTtvQkFDN0IsSUFBSSxFQUFFLElBQUksSUFBSSxDQUFDLHlDQUF5QyxDQUFDO2lCQUMxRDthQUNGO1lBRUQsTUFBTSxFQUFFO2dCQUNOLFFBQVEsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUM7Z0JBQ25DLE9BQU8sRUFBRSxNQUFNO2dCQUNmLElBQUksRUFBRSxLQUFLO2FBQ1o7WUFFRCxFQUFFLEVBQUU7Z0JBQ0YsVUFBVSxFQUFFLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQzthQUNoQztTQUNULENBQUMsQ0FBQztRQUVILGdDQUFnQztRQUNoQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ3hC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