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
            var z = camera.position.z.toFixed(0).toString();
            log.message("Heading: " + padLeft(heading, 5) + ", tilt: " + padLeft(tilt, 5) + ", z: " + padLeft(z, 5));
            overview.view.rotation = 360 - camera.heading;
        });
        window["view"] = view;
    }
    exports.initialize = initialize;
    function play(argument) {
        var camera = view.camera.clone();
        switch (argument) {
            case "heading":
                camera.heading += 10;
                break;
            case "tilt":
                camera.tilt -= 5;
                break;
            case "z":
                camera.position.z += 100;
                break;
        }
        view.camera = camera;
    }
    exports.play = play;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMDEtc2ltcGxlLWNhbWVyYS1pbmNyZW1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIwMS1zaW1wbGUtY2FtZXJhLWluY3JlbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztJQVdBLElBQUksSUFBZSxDQUFDO0lBRXBCO1FBQ0UsSUFBSSxHQUFHLElBQUksU0FBUyxDQUFDO1lBQ25CLFNBQVMsRUFBRSxTQUFTO1lBRXBCLEdBQUcsRUFBRSxJQUFJLEdBQUcsQ0FBQztnQkFDWCxPQUFPLEVBQUUsUUFBUTtnQkFDakIsTUFBTSxFQUFFLGlCQUFpQjthQUMxQixDQUFDO1lBRUYsY0FBYyxFQUFFLE1BQU07WUFFdEIsV0FBVyxFQUFFO2dCQUNYLFVBQVUsRUFBRTtvQkFDVixPQUFPLEVBQUUsTUFBTTtpQkFDaEI7Z0JBRUQsUUFBUSxFQUFFO29CQUNSLG9CQUFvQixFQUFFLElBQUk7b0JBQzFCLHVCQUF1QixFQUFFLElBQUk7aUJBQzlCO2FBQ0Y7WUFFRCxNQUFNLEVBQUU7Z0JBQ04sUUFBUSxFQUFFLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUM7Z0JBQy9CLE9BQU8sRUFBRSxFQUFFO2dCQUNYLElBQUksRUFBRSxFQUFFO2FBQ1Q7WUFFRCxFQUFFLEVBQUU7Z0JBQ0YsVUFBVSxFQUFFLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQzthQUNoQztTQUNULENBQUMsQ0FBQztRQUVILElBQU0sUUFBUSxHQUFHLDJCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXpDLDBCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXZCLGlCQUFpQixDQUFTLEVBQUUsQ0FBUztZQUNuQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ25ELENBQUM7WUFDRCxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ1gsQ0FBQztRQUNILENBQUM7UUFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxVQUFDLE1BQW1CO1lBQ3ZDLElBQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3JELElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQy9DLElBQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUVsRCxHQUFHLENBQUMsT0FBTyxDQUFDLGNBQVksT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsZ0JBQVcsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsYUFBUSxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBRyxDQUFDLENBQUM7WUFFL0YsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDaEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ3hCLENBQUM7SUF6REQsZ0NBeURDO0lBRUQsY0FBcUIsUUFBaUI7UUFDcEMsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUVuQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLEtBQUssU0FBUztnQkFDWixNQUFNLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztnQkFDckIsS0FBSyxDQUFDO1lBQ1IsS0FBSyxNQUFNO2dCQUNULE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDO2dCQUNqQixLQUFLLENBQUM7WUFDUixLQUFLLEdBQUc7Z0JBQ04sTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDO2dCQUN6QixLQUFLLENBQUM7UUFDVixDQUFDO1FBRUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQWhCRCxvQkFnQkMifQ==