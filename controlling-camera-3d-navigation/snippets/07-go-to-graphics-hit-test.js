define(["require", "exports", "esri/Map", "esri/layers/FeatureLayer", "esri/renderers/UniqueValueRenderer", "esri/symbols/PolygonSymbol3D", "esri/symbols/ExtrudeSymbol3DLayer", "esri/views/SceneView", "./support/log", "./support/widgets"], function (require, exports, Map, FeatureLayer, UniqueValueRenderer, PolygonSymbol3D, ExtrudeSymbol3DLayer, SceneView, log, widgets_1) {
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
            }
        });
        view.on("double-click", function (event) {
            event.stopPropagation();
            view.hitTest({ x: event.x, y: event.y })
                .then(function (hitResult) {
                var graphic = (hitResult.results[0] &&
                    hitResult.results[0].graphic);
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
    }
    exports.play = play;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMDctZ28tdG8tZ3JhcGhpY3MtaGl0LXRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIwNy1nby10by1ncmFwaGljcy1oaXQtdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztJQTRCQSxJQUFJLElBQWUsQ0FBQztJQUVwQjtRQUNFLFVBQVUsRUFBRSxDQUFDO1FBQ2IsYUFBYSxFQUFFLENBQUM7SUFDbEIsQ0FBQztJQUhELGdDQUdDO0lBRUQ7UUFDRSxJQUFNLEtBQUssR0FBRyxXQUFXLEVBQUUsQ0FBQztRQUU1Qiw4REFBOEQ7UUFDOUQsMEJBQTBCO1FBQzFCLElBQUksR0FBRyxJQUFJLFNBQVMsQ0FBQztZQUNuQixTQUFTLEVBQUUsU0FBUztZQUVwQixHQUFHLEVBQUUsSUFBSSxHQUFHLENBQUM7Z0JBQ1gsT0FBTyxFQUFFLGdCQUFnQjtnQkFDekIsTUFBTSxFQUFFLGlCQUFpQjtnQkFDekIsTUFBTSxFQUFFLENBQUUsS0FBSyxDQUFTO2FBQ3pCLENBQUM7WUFFRixjQUFjLEVBQUUsTUFBTTtZQUV0QixXQUFXLEVBQUU7Z0JBQ1gsVUFBVSxFQUFFO29CQUNWLE9BQU8sRUFBRSxNQUFNO2lCQUNoQjtnQkFFRCxRQUFRLEVBQUU7b0JBQ1Isb0JBQW9CLEVBQUUsSUFBSTtvQkFDMUIsdUJBQXVCLEVBQUUsSUFBSTtpQkFDOUI7YUFDRjtZQUVELE1BQU0sRUFBRTtnQkFDTixRQUFRLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDO2dCQUNuQyxPQUFPLEVBQUUsTUFBTTtnQkFDZixJQUFJLEVBQUUsS0FBSzthQUNaO1lBRUQsRUFBRSxFQUFFO2dCQUNGLFVBQVUsRUFBRSxDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUM7YUFDaEM7U0FDVCxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxVQUFDLEtBQVU7WUFDakMsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBRXhCLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFFLENBQUMsRUFBQyxDQUFDO2lCQUNuQyxJQUFJLENBQUMsVUFBQyxTQUFjO2dCQUNuQixJQUFNLE9BQU8sR0FBRyxDQUNkLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUNwQixTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FDN0IsQ0FBQztnQkFFRixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUNaLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFFeEMsSUFBSSxDQUFDLElBQUksQ0FBQzt3QkFDUixNQUFNLEVBQUUsT0FBTzt3QkFDZixLQUFLLEVBQUUsSUFBSTt3QkFDWCxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsRUFBRTtxQkFDbEMsRUFBRSxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUMzQixDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDVCxDQUFDLENBQUMsQ0FBQztRQUVILGdDQUFnQztRQUNoQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ3hCLENBQUM7SUFFRDtRQUNFLElBQU0sTUFBTSxHQUFHLElBQUksZUFBZSxDQUFDO1lBQ2pDLFlBQVksRUFBRTtnQkFDWixJQUFJLG9CQUFvQixDQUFDO29CQUN2QixRQUFRLEVBQUU7d0JBQ1IsS0FBSyxFQUFFLFNBQVM7cUJBQ2pCO2lCQUNGLENBQUM7YUFDSTtTQUNULENBQUMsQ0FBQztRQUVILElBQU0sUUFBUSxHQUFHLElBQUksZUFBZSxDQUFDO1lBQ25DLFlBQVksRUFBRTtnQkFDWixJQUFJLG9CQUFvQixDQUFDO29CQUN2QixRQUFRLEVBQUU7d0JBQ1IsS0FBSyxFQUFFLE1BQU07cUJBQ2Q7aUJBQ0YsQ0FBQzthQUNJO1NBQ1QsQ0FBQyxDQUFDO1FBRUgsSUFBTSxRQUFRLEdBQUcsSUFBSSxtQkFBbUIsQ0FBQztZQUN2QyxhQUFhLEVBQUUsSUFBSSxlQUFlLENBQUM7Z0JBQ2pDLFlBQVksRUFBRTtvQkFDWixJQUFJLG9CQUFvQixDQUFDO3dCQUN2QixRQUFRLEVBQUU7NEJBQ1IsS0FBSyxFQUFFLFNBQVM7eUJBQ2pCO3FCQUNGLENBQUM7aUJBQ0k7YUFDVCxDQUFDO1lBRUYsWUFBWSxFQUFFLE9BQU87WUFDckIsS0FBSyxFQUFFLFFBQVE7WUFFZixnQkFBZ0IsRUFBRTtnQkFDaEI7b0JBQ0UsS0FBSyxFQUFFLGFBQWE7b0JBQ3BCLE1BQU0sRUFBRSxNQUFNO29CQUNkLEtBQUssRUFBRSxhQUFhO2lCQUNyQixFQUFFO29CQUNELEtBQUssRUFBRSx5QkFBeUI7b0JBQ2hDLE1BQU0sRUFBRSxRQUFRO29CQUNoQixLQUFLLEVBQUUsYUFBYTtpQkFDckI7YUFDRjtZQUVELGVBQWUsRUFBRTtnQkFDZjtvQkFDRSxJQUFJLEVBQUUsTUFBTTtvQkFDWixLQUFLLEVBQUUsV0FBVztvQkFDbEIsU0FBUyxFQUFFLE1BQU0sQ0FBQyxnREFBZ0Q7aUJBQ25FO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsSUFBSSxZQUFZLENBQUM7WUFDdEIsR0FBRyxFQUFFLDhGQUE4RjtZQUVuRyxRQUFRLEVBQUUsUUFBUTtZQUVsQixhQUFhLEVBQUU7Z0JBQ2IsS0FBSyxFQUFFLFVBQVU7Z0JBQ2pCLE9BQU8sRUFBRSxDQUFDO3dCQUNSLElBQUksRUFBRSxRQUFRO3dCQUNkLFVBQVUsRUFBRSxDQUFDO2dDQUNYLFNBQVMsRUFBRSxTQUFTO2dDQUNwQixLQUFLLEVBQUUsU0FBUzs2QkFDakIsRUFBRTtnQ0FDRCxTQUFTLEVBQUUsUUFBUTtnQ0FDbkIsS0FBSyxFQUFFLE1BQU07NkJBQ2QsRUFBRTtnQ0FDRCxTQUFTLEVBQUUsV0FBVztnQ0FDdEIsS0FBSyxFQUFFLFFBQVE7NkJBQ2hCLENBQUM7cUJBQ0gsQ0FBQzthQUNIO1lBRUQsU0FBUyxFQUFFLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxXQUFXLENBQUM7WUFFN0Msb0JBQW9CLEVBQUUsZUFBZTtTQUN0QyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7UUFDRSxJQUFNLFFBQVEsR0FBRywyQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV6QywwQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBRUQ7SUFDQSxDQUFDO0lBREQsb0JBQ0MifQ==