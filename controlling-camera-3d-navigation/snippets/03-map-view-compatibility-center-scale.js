define(["require", "exports", "esri/Map", "esri/Graphic", "esri/layers/FeatureLayer", "esri/symbols/PointSymbol3D", "esri/symbols/IconSymbol3DLayer", "esri/views/SceneView", "./support/log", "./support/widgets"], function (require, exports, Map, Graphic, FeatureLayer, PointSymbol3D, IconSymbol3DLayer, SceneView, log, widgets_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var view;
    function initialize() {
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
                    ambientOcclusionEnabled: true,
                    date: new Date("Wed Mar 15 2017 12:00:00 GMT+0100 (CET)")
                }
            },
            camera: {
                position: [7.755, 46.388, 4609.08],
                heading: 11.06,
                tilt: 79.11
            },
            ui: {
                components: ["compass", "attribution"]
            }
        });
        var overview = widgets_1.createOverviewMap(view);
        widgets_1.createFullscreen(view);
        function padLeft(s, n) {
            if (s.length < n) {
                return new Array(n - s.length + 1).join(" ") + s;
            }
            else {
                return s;
            }
        }
        var centerSymbol = new PointSymbol3D({
            symbolLayers: [
                new IconSymbol3DLayer({
                    resource: {
                        primitive: "circle"
                    },
                    material: {
                        color: "red"
                    },
                    outline: {
                        color: "white",
                        size: 2
                    },
                    size: 22
                }),
                new IconSymbol3DLayer({
                    resource: {
                        primitive: "x"
                    },
                    outline: {
                        color: "white",
                        size: 3
                    },
                    size: 6
                })
            ]
        });
        var featureCollection = new FeatureLayer({
            source: [],
            geometryType: "points",
            fields: [],
            objectIdField: "OBJECTID",
            elevationInfo: {
                mode: "on-the-ground"
            }
        });
        view.map.add(featureCollection);
        var centerGraphic;
        view.watch("camera", function (camera) {
            var center = view.center.clone();
            if (centerGraphic) {
                featureCollection.source.remove(centerGraphic);
            }
            centerGraphic = new Graphic({
                geometry: center,
                symbol: centerSymbol
            });
            featureCollection.source.add(centerGraphic);
            var scale = view.scale.toFixed(0).toString();
            log.message("Scale: " + padLeft(scale, 8));
            overview.view.rotation = 360 - camera.heading;
        });
        window["view"] = view;
    }
    exports.initialize = initialize;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMDMtbWFwLXZpZXctY29tcGF0aWJpbGl0eS1jZW50ZXItc2NhbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIwMy1tYXAtdmlldy1jb21wYXRpYmlsaXR5LWNlbnRlci1zY2FsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztJQXVCQSxJQUFJLElBQWUsQ0FBQztJQUVwQjtRQUNFLElBQUksR0FBRyxJQUFJLFNBQVMsQ0FBQztZQUNuQixTQUFTLEVBQUUsU0FBUztZQUVwQixHQUFHLEVBQUUsSUFBSSxHQUFHLENBQUM7Z0JBQ1gsT0FBTyxFQUFFLFFBQVE7Z0JBQ2pCLE1BQU0sRUFBRSxpQkFBaUI7YUFDMUIsQ0FBQztZQUVGLGNBQWMsRUFBRSxNQUFNO1lBRXRCLFdBQVcsRUFBRTtnQkFDWCxVQUFVLEVBQUU7b0JBQ1YsT0FBTyxFQUFFLE1BQU07aUJBQ2hCO2dCQUVELFFBQVEsRUFBRTtvQkFDUixvQkFBb0IsRUFBRSxJQUFJO29CQUMxQix1QkFBdUIsRUFBRSxJQUFJO29CQUM3QixJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMseUNBQXlDLENBQUM7aUJBQzFEO2FBQ0Y7WUFFRCxNQUFNLEVBQUU7Z0JBQ04sUUFBUSxFQUFFLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUM7Z0JBQ2xDLE9BQU8sRUFBRSxLQUFLO2dCQUNkLElBQUksRUFBRSxLQUFLO2FBQ1o7WUFFRCxFQUFFLEVBQUU7Z0JBQ0YsVUFBVSxFQUFFLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQzthQUNoQztTQUNULENBQUMsQ0FBQztRQUVILElBQU0sUUFBUSxHQUFHLDJCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXpDLDBCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXZCLGlCQUFpQixDQUFTLEVBQUUsQ0FBUztZQUNuQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLE1BQU0sQ0FB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