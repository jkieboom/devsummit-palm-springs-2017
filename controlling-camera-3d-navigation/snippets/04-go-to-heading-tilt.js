define(["require", "exports", "esri/Map", "esri/views/SceneView", "./support/log", "./support/widgets"], function (require, exports, Map, SceneView, log, widgets_1) {
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
        function padLeft(s, n) {
            if (s.length < n) {
                return new Array(n - s.length + 1).join(" ") + s;
            }
            else {
                return s;
            }
        }
        view.watch("camera", function (camera) {
            var heading = camera.heading.toFixed(1).toString();
            var tilt = camera.tilt.toFixed(1).toString();
            log.message("Heading: " + padLeft(heading, 5) + ", tilt: " + padLeft(tilt, 5));
            overview.view.rotation = 360 - camera.heading;
        });
        window["view"] = view;
    }
    exports.initialize = initialize;
    function playHeading() {
        var currentHeading = view.camera.heading;
        var heading = Math.floor((currentHeading + 1) / 30) * 30 + 30;
        view.goTo({ heading: heading });
    }
    function playTilt() {
        var currentTilt = view.camera.tilt;
        // Cycle tilt of the view
        var tilt = (Math.floor((currentTilt + 1) / 15) * 15 + 15) % 90;
        // go to tilt preserves view.center
        view.goTo({ tilt: tilt });
    }
    function play(argument) {
        switch (argument) {
            case "heading":
                playHeading();
                break;
            case "tilt":
                playTilt();
                break;
        }
    }
    exports.play = play;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMDQtZ28tdG8taGVhZGluZy10aWx0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiMDQtZ28tdG8taGVhZGluZy10aWx0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0lBV0EsSUFBSSxJQUFlLENBQUM7SUFFcEI7UUFDRSxJQUFJLEdBQUcsSUFBSSxTQUFTLENBQUM7WUFDbkIsU0FBUyxFQUFFLFNBQVM7WUFFcEIsR0FBRyxFQUFFLElBQUksR0FBRyxDQUFDO2dCQUNYLE9BQU8sRUFBRSxRQUFRO2dCQUNqQixNQUFNLEVBQUUsaUJBQWlCO2FBQzFCLENBQUM7WUFFRixjQUFjLEVBQUUsTUFBTTtZQUV0QixXQUFXLEVBQUU7Z0JBQ1gsVUFBVSxFQUFFO29CQUNWLE9BQU8sRUFBRSxNQUFNO2lCQUNoQjtnQkFFRCxRQUFRLEVBQUU7b0JBQ1Isb0JBQW9CLEVBQUUsSUFBSTtvQkFDMUIsdUJBQXVCLEVBQUUsSUFBSTtpQkFDOUI7YUFDRjtZQUVELE1BQU0sRUFBRTtnQkFDTixRQUFRLEVBQUUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQztnQkFDL0IsT0FBTyxFQUFFLEVBQUU7Z0JBQ1gsSUFBSSxFQUFFLEVBQUU7YUFDVDtZQUVELEVBQUUsRUFBRTtnQkFDRixVQUFVLEVBQUUsQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDO2FBQ2hDO1NBQ1QsQ0FBQyxDQUFDO1FBRUgsSUFBTSxRQUFRLEdBQUcsMkJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFekMsMEJBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFdkIsaUJBQWlCLENBQVMsRUFBRSxDQUFTO1lBQ25DLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakIsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkQsQ0FBQztZQUNELElBQUksQ0FBQyxDQUFDO2dCQUNKLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDWCxDQUFDO1FBQ0gsQ0FBQztRQUVELElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLFVBQUMsTUFBbUI7WUFDdkMsSUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDckQsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7WUFFL0MsR0FBRyxDQUFDLE9BQU8sQ0FBQyxjQUFZLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLGdCQUFXLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFHLENBQUMsQ0FBQztZQUUxRSxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUNoRCxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDeEIsQ0FBQztJQXhERCxnQ0F3REM7SUFFRDtRQUNFLElBQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQzNDLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUVoRSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxTQUFBLEVBQUUsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFRDtRQUNFLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBRXJDLHlCQUF5QjtRQUN6QixJQUFNLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUVqRSxtQ0FBbUM7UUFDbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksTUFBQSxFQUFFLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBRUQsY0FBcUIsUUFBaUI7UUFDcEMsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNqQixLQUFLLFNBQVM7Z0JBQ1osV0FBVyxFQUFFLENBQUM7Z0JBQ2QsS0FBSyxDQUFDO1lBQ1IsS0FBSyxNQUFNO2dCQUNULFFBQVEsRUFBRSxDQUFDO2dCQUNYLEtBQUssQ0FBQztRQUNWLENBQUM7SUFDSCxDQUFDO0lBVEQsb0JBU0MifQ==