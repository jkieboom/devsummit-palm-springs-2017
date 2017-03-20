define(["require", "exports", "esri/Map", "esri/views/SceneView", "./support/widgets"], function (require, exports, Map, SceneView, widgets_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var view;
    function initialize() {
        createView();
        installDragHandler();
        createWidgets();
    }
    exports.initialize = initialize;
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
            }
        });
        // Store on window for debugging
        window["view"] = view;
    }
    function installDragHandler() {
        var center;
        var screenPoint;
        var scale;
        var camera;
        var isDragging = false;
        view.on("drag", function (event) {
            if (event.native.ctrlKey) {
                return;
            }
            switch (event.action) {
                case "start":
                    if (event.native.button !== 0) {
                        return;
                    }
                    isDragging = true;
                    center = view.center.clone();
                    screenPoint = { x: event.x, y: event.y };
                    scale = view.scale;
                    camera = view.camera.clone();
                    break;
                case "update":
                    if (!isDragging) {
                        return;
                    }
                    var dx = event.x - screenPoint.x;
                    var newCenter = center.clone();
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
        var overview = widgets_1.createOverviewMap(view);
        widgets_1.createFullscreen(view);
    }
    function play() {
    }
    exports.play = play;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTAtZHJhZy1sb2NrLWhlYWRpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIxMC1kcmFnLWxvY2staGVhZGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztJQVdBLElBQUksSUFBZSxDQUFDO0lBRXBCO1FBQ0UsVUFBVSxFQUFFLENBQUM7UUFDYixrQkFBa0IsRUFBRSxDQUFDO1FBQ3JCLGFBQWEsRUFBRSxDQUFDO0lBQ2xCLENBQUM7SUFKRCxnQ0FJQztJQUVEO1FBQ0UsOERBQThEO1FBQzlELDBCQUEwQjtRQUMxQixJQUFJLEdBQUcsSUFBSSxTQUFTLENBQUM7WUFDbkIsU0FBUyxFQUFFLFNBQVM7WUFFcEIsR0FBRyxFQUFFLElBQUksR0FBRyxDQUFDO2dCQUNYLE9BQU8sRUFBRSxRQUFRO2dCQUNqQixNQUFNLEVBQUUsaUJBQWlCO2FBQzFCLENBQUM7WUFFRixjQUFjLEVBQUUsTUFBTTtZQUV0QixXQUFXLEVBQUU7Z0JBQ1gsVUFBVSxFQUFFO29CQUNWLE9BQU8sRUFBRSxNQUFNO2lCQUNoQjtnQkFFRCxRQUFRLEVBQUU7b0JBQ1Isb0JBQW9CLEVBQUUsSUFBSTtvQkFDMUIsdUJBQXVCLEVBQUUsSUFBSTtpQkFDOUI7YUFDRjtZQUVELE1BQU0sRUFBRTtnQkFDTixRQUFRLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsV0FBVyxDQUFDO2dCQUN2QyxPQUFPLEVBQUUsS0FBSztnQkFDZCxJQUFJLEVBQUUsS0FBSzthQUNaO1lBRUQsRUFBRSxFQUFFO2dCQUNGLFVBQVUsRUFBRSxDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUM7YUFDaEM7U0FDVCxDQUFDLENBQUM7UUFFSCxnQ0FBZ0M7UUFDaEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQztJQUN4QixDQUFDO0lBRUQ7UUFDRSxJQUFJLE1BQWtCLENBQUM7UUFDdkIsSUFBSSxXQUFzQyxDQUFDO1FBQzNDLElBQUksS0FBYSxDQUFDO1FBQ2xCLElBQUksTUFBbUIsQ0FBQztRQUN4QixJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFFdkIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBQyxLQUFVO1lBQ3pCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDekIsTUFBTSxDQUFDO1lBQ1QsQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNyQixLQUFLLE9BQU87b0JBQ1YsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDOUIsTUFBTSxDQUFDO29CQUNULENBQUM7b0JBRUQsVUFBVSxHQUFHLElBQUksQ0FBQztvQkFFbEIsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFnQixDQUFDO29CQUMzQyxXQUFXLEdBQUcsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDO29CQUN6QyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztvQkFDbkIsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBRTdCLEtBQUssQ0FBQztnQkFDUixLQUFLLFFBQVE7b0JBQ1gsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO3dCQUNoQixNQUFNLENBQUM7b0JBQ1QsQ0FBQztvQkFFRCxJQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUM7b0JBRW5DLElBQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQWdCLENBQUM7b0JBQy9DLFNBQVMsQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUM7b0JBRWpDLElBQUksQ0FBQyxJQUFJLENBQUM7d0JBQ1IsTUFBTSxFQUFFLFNBQVM7d0JBQ2pCLEtBQUssRUFBRSxLQUFLO3dCQUNaLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTzt3QkFDdkIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO3FCQUNsQixFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7b0JBRXZCLEtBQUssQ0FBQztnQkFDUixLQUFLLEtBQUs7b0JBQ1IsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO3dCQUNoQixNQUFNLENBQUM7b0JBQ1QsQ0FBQztvQkFFRCxVQUFVLEdBQUcsS0FBSyxDQUFDO29CQUVuQixLQUFLLENBQUM7WUFDVixDQUFDO1lBRUQsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQzFCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEO1FBQ0UsSUFBTSxRQUFRLEdBQUcsMkJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFekMsMEJBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVEO0lBQ0EsQ0FBQztJQURELG9CQUNDIn0=