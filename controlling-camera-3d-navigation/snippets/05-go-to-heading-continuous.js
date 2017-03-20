define(["require", "exports", "esri/Map", "esri/core/watchUtils", "esri/views/SceneView", "./support/log", "./support/widgets", "./support/strings"], function (require, exports, Map, watchUtils, SceneView, log, widgets_1, strings_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var view;
    // State
    var isLookAround = false;
    var isStableRotation = true;
    var animationFrameHandler = 0;
    // Center, scale and position to use for animation
    var animationCenter;
    var animationScale;
    var animationPosition;
    function initialize() {
        createView();
        createWidgets();
        view.then(function () {
            // Watch whenever the view goes from !stationary to stationary
            // (e.g. user stops interacting) and update the animation origin
            // from the new viewpoint
            watchUtils.when(view, "stationary", function () {
                updateAnimationOrigin();
            });
        });
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
                position: [8.632, 46.522, 7000],
                heading: 25,
                tilt: 75
            },
            ui: {
                components: ["compass", "attribution"]
            }
        });
        // Store on window for debugging
        window["view"] = view;
    }
    function createWidgets() {
        var overview = widgets_1.createOverviewMap(view);
        widgets_1.createFullscreen(view);
        // Widget to turn on/off stable rotation
        widgets_1.add(view, "<div><input type=\"checkbox\" checked> Stable rotation</div>", {
            click: function (event) {
                isStableRotation = !!event.target.checked;
            }
        });
        // Widget to turn on/off look around
        widgets_1.add(view, "<div><input type=\"checkbox\"> Enable look around</div>", {
            click: function (event) {
                // Update the animation origin when we switch to use the current viewpoint
                updateAnimationOrigin();
                isLookAround = !!event.target.checked;
            }
        });
        view.then(function () {
            view.watch("camera", function (camera) {
                // Show heading tilt in log
                var heading = camera.heading.toFixed(1).toString();
                var tilt = camera.tilt.toFixed(1).toString();
                log.message("Heading: " + strings_1.padLeft(heading, 5) + ", tilt: " + strings_1.padLeft(tilt, 5));
                // Synchronize rotation of the overview map with the SceneView
                overview.view.rotation = 360 - camera.heading;
            });
        });
    }
    function updateAnimationOrigin() {
        animationScale = view.scale;
        animationCenter = view.center.clone();
        animationPosition = view.camera.position.clone();
    }
    function animateLookAroundStep() {
        if (isStableRotation) {
            view.goTo({
                position: animationPosition,
                heading: view.camera.heading - 0.1
            }, { animate: false });
        }
        else {
            view.goTo({
                heading: view.camera.heading - 0.1
            }, { animate: false });
        }
    }
    function animateRotateAroundStep() {
        if (isStableRotation) {
            view.goTo({
                center: animationCenter,
                scale: animationScale,
                heading: view.camera.heading + 0.1
            }, { animate: false });
        }
        else {
            view.goTo({
                center: view.center,
                heading: view.camera.heading + 0.1
            }, { animate: false });
        }
    }
    function animate() {
        if (view.stationary) {
            if (isLookAround) {
                animateLookAroundStep();
            }
            else {
                animateRotateAroundStep();
            }
        }
        animationFrameHandler = requestAnimationFrame(animate);
    }
    function play(argument) {
        if (animationFrameHandler) {
            cancelAnimationFrame(animationFrameHandler);
            animationFrameHandler = 0;
            return;
        }
        updateAnimationOrigin();
        animate();
    }
    exports.play = play;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMDUtZ28tdG8taGVhZGluZy1jb250aW51b3VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiMDUtZ28tdG8taGVhZGluZy1jb250aW51b3VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0lBZUEsSUFBSSxJQUFlLENBQUM7SUFFcEIsUUFBUTtJQUNSLElBQUksWUFBWSxHQUFHLEtBQUssQ0FBQztJQUN6QixJQUFJLGdCQUFnQixHQUFHLElBQUksQ0FBQztJQUM1QixJQUFJLHFCQUFxQixHQUFHLENBQUMsQ0FBQztJQUU5QixrREFBa0Q7SUFDbEQsSUFBSSxlQUEyQixDQUFDO0lBQ2hDLElBQUksY0FBc0IsQ0FBQztJQUMzQixJQUFJLGlCQUE2QixDQUFDO0lBRWxDO1FBQ0UsVUFBVSxFQUFFLENBQUM7UUFDYixhQUFhLEVBQUUsQ0FBQztRQUVoQixJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ1IsOERBQThEO1lBQzlELGdFQUFnRTtZQUNoRSx5QkFBeUI7WUFDekIsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO2dCQUNsQyxxQkFBcUIsRUFBRSxDQUFDO1lBQzFCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBWkQsZ0NBWUM7SUFFRDtRQUNFLDhEQUE4RDtRQUM5RCwwQkFBMEI7UUFDMUIsSUFBSSxHQUFHLElBQUksU0FBUyxDQUFDO1lBQ25CLFNBQVMsRUFBRSxTQUFTO1lBRXBCLEdBQUcsRUFBRSxJQUFJLEdBQUcsQ0FBQztnQkFDWCxPQUFPLEVBQUUsUUFBUTtnQkFDakIsTUFBTSxFQUFFLGlCQUFpQjthQUMxQixDQUFDO1lBRUYsY0FBYyxFQUFFLE1BQU07WUFFdEIsV0FBVyxFQUFFO2dCQUNYLFVBQVUsRUFBRTtvQkFDVixPQUFPLEVBQUUsTUFBTTtpQkFDaEI7Z0JBRUQsUUFBUSxFQUFFO29CQUNSLG9CQUFvQixFQUFFLElBQUk7b0JBQzFCLHVCQUF1QixFQUFFLElBQUk7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