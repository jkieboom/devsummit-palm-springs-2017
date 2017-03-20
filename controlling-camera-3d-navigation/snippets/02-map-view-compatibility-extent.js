define(["require", "exports", "esri/Map", "esri/Graphic", "esri/layers/SceneLayer", "esri/symbols/PolygonSymbol3D", "esri/symbols/FillSymbol3DLayer", "esri/views/SceneView", "./support/widgets"], function (require, exports, Map, Graphic, SceneLayer, PolygonSymbol3D, FillSymbol3DLayer, SceneView, widgets_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var view;
    function initialize() {
        view = new SceneView({
            container: "viewDiv",
            map: new Map({
                basemap: "hybrid",
                ground: "world-elevation",
                layers: [
                    new SceneLayer({
                        portalItem: {
                            id: "fad90a1b2f5243f99c2d49aa6719bfd7"
                        }
                    })
                ]
            }),
            qualityProfile: "high",
            environment: {
                lighting: {
                    directShadowsEnabled: true,
                    ambientOcclusionEnabled: true,
                    date: new Date("Thu Mar 16 2017 00:00:00 GMT+0100 (CET)")
                }
            },
            camera: {
                position: [-117.172, 32.708, 139.53],
                heading: 68.92,
                tilt: 79.27
            },
            ui: {
                components: ["compass", "attribution"]
            }
        });
        var overview = widgets_1.createOverviewMap(view);
        widgets_1.createFullscreen(view);
        var layer = view.map.layers.getItemAt(0);
        layer.then(function () {
            var graphic = new Graphic({
                geometry: layer.fullExtent.clone(),
                symbol: new PolygonSymbol3D({
                    symbolLayers: [
                        new FillSymbol3DLayer({
                            material: {
                                color: "rgba(0, 255, 0, 0.3)",
                            },
                            outline: {
                                color: "white",
                                size: 3
                            },
                            elevationInfo: {
                                mode: "on-the-ground"
                            }
                        })
                    ]
                })
            });
            view.graphics.add(graphic);
        });
        window["view"] = view;
    }
    exports.initialize = initialize;
    function play(argument) {
        view.extent = view.map.layers.getItemAt(0).fullExtent;
    }
    exports.play = play;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMDItbWFwLXZpZXctY29tcGF0aWJpbGl0eS1leHRlbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIwMi1tYXAtdmlldy1jb21wYXRpYmlsaXR5LWV4dGVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztJQXNCQSxJQUFJLElBQWUsQ0FBQztJQUVwQjtRQUNFLElBQUksR0FBRyxJQUFJLFNBQVMsQ0FBQztZQUNuQixTQUFTLEVBQUUsU0FBUztZQUVwQixHQUFHLEVBQUUsSUFBSSxHQUFHLENBQUM7Z0JBQ1gsT0FBTyxFQUFFLFFBQVE7Z0JBQ2pCLE1BQU0sRUFBRSxpQkFBaUI7Z0JBRXpCLE1BQU0sRUFBRTtvQkFDTixJQUFJLFVBQVUsQ0FBQzt3QkFDYixVQUFVLEVBQUU7NEJBQ1YsRUFBRSxFQUFFLGtDQUFrQzt5QkFDdkM7cUJBQ0YsQ0FBQztpQkFDSTthQUNULENBQUM7WUFFRixjQUFjLEVBQUUsTUFBTTtZQUV0QixXQUFXLEVBQUU7Z0JBQ1gsUUFBUSxFQUFFO29CQUNSLG9CQUFvQixFQUFFLElBQUk7b0JBQzFCLHVCQUF1QixFQUFFLElBQUk7b0JBQzdCLElBQUksRUFBRSxJQUFJLElBQUksQ0FBQyx5Q0FBeUMsQ0FBQztpQkFDMUQ7YUFDRjtZQUVELE1BQU0sRUFBRTtnQkFDTixRQUFRLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDO2dCQUNwQyxPQUFPLEVBQUUsS0FBSztnQkFDZCxJQUFJLEVBQUUsS0FBSzthQUNaO1lBRUQsRUFBRSxFQUFFO2dCQUNGLFVBQVUsRUFBRSxDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUM7YUFDaEM7U0FDVCxDQUFDLENBQUM7UUFFSCxJQUFNLFFBQVEsR0FBRywyQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV6QywwQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV2QixJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFM0MsS0FBSyxDQUFDLElBQUksQ0FBQztZQUNULElBQU0sT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDO2dCQUMxQixRQUFRLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2xDLE1BQU0sRUFBRSxJQUFJLGVBQWUsQ0FBQztvQkFDMUIsWUFBWSxFQUFFO3dCQUNaLElBQUksaUJBQWlCLENBQUM7NEJBQ3BCLFFBQVEsRUFBRTtnQ0FDUixLQUFLLEVBQUUsc0JBQXNCOzZCQUM5Qjs0QkFFRCxPQUFPLEVBQUU7Z0NBQ1AsS0FBSyxFQUFFLE9BQU87Z0NBQ2QsSUFBSSxFQUFFLENBQUM7NkJBQ1I7NEJBRUQsYUFBYSxFQUFFO2dDQUNiLElBQUksRUFBRSxlQUFlOzZCQUN0Qjt5QkFDSyxDQUFDO3FCQUNIO2lCQUNULENBQUM7YUFDSCxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QixDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDeEIsQ0FBQztJQXZFRCxnQ0F1RUM7SUFFRCxjQUFxQixRQUFpQjtRQUNwQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7SUFDeEQsQ0FBQztJQUZELG9CQUVDIn0=