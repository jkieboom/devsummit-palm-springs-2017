define(["require", "exports", "esri/Map", "esri/views/SceneView", "./support/widgets"], function (require, exports, Map, SceneView, widgets_1) {
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
            }
        });
        var overview = widgets_1.createOverviewMap(view);
        widgets_1.createFullscreen(view);
        window["view"] = view;
    }
    exports.initialize = initialize;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMDkta2V5Ym9hcmQtYW5kLXRvdWNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiMDkta2V5Ym9hcmQtYW5kLXRvdWNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0lBV0EsSUFBSSxJQUFlLENBQUM7SUFFcEI7UUFDRSxJQUFJLEdBQUcsSUFBSSxTQUFTLENBQUM7WUFDbkIsU0FBUyxFQUFFLFNBQVM7WUFFcEIsR0FBRyxFQUFFLElBQUksR0FBRyxDQUFDO2dCQUNYLE9BQU8sRUFBRSxRQUFRO2dCQUNqQixNQUFNLEVBQUUsaUJBQWlCO2FBQzFCLENBQUM7WUFFRixjQUFjLEVBQUUsTUFBTTtZQUV0QixXQUFXLEVBQUU7Z0JBQ1gsVUFBVSxFQUFFO29CQUNWLE9BQU8sRUFBRSxNQUFNO2lCQUNoQjtnQkFFRCxRQUFRLEVBQUU7b0JBQ1Isb0JBQW9CLEVBQUUsSUFBSTtvQkFDMUIsdUJBQXVCLEVBQUUsSUFBSTtpQkFDOUI7YUFDRjtZQUVELE1BQU0sRUFBRTtnQkFDTixRQUFRLEVBQUUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQztnQkFDL0IsT0FBTyxFQUFFLEVBQUU7Z0JBQ1gsSUFBSSxFQUFFLEVBQUU7YUFDVDtZQUVELEVBQUUsRUFBRTtnQkFDRixVQUFVLEVBQUUsQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDO2FBQ2hDO1NBQ1QsQ0FBQyxDQUFDO1FBRUgsSUFBTSxRQUFRLEdBQUcsMkJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFekMsMEJBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFdkIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQztJQUN4QixDQUFDO0lBdENELGdDQXNDQyJ9