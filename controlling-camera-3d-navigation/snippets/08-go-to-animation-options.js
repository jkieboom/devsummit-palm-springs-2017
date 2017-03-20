define(["require", "exports", "esri/WebScene", "esri/views/SceneView", "./support/widgets"], function (require, exports, WebScene, SceneView, widgets_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var view;
    function initialize() {
        createView();
        createSlides();
        createWidgets();
    }
    exports.initialize = initialize;
    function createView() {
        view = new SceneView({
            container: "viewDiv",
            map: new WebScene({
                portalItem: {
                    id: "089193cc66084c4bac18e65b899e1c03"
                }
            }),
            padding: {
                bottom: 160
            },
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
            ui: {
                components: ["compass", "attribution"]
            }
        });
        var overview = widgets_1.createOverviewMap(view);
        widgets_1.createFullscreen(view);
        window["view"] = view;
    }
    function customEasingBounce(t) {
        return 1 - Math.abs(Math.sin(-1.7 + t * 4.5 * Math.PI)) * Math.pow(0.5, t * 10);
    }
    function createSlides() {
        var slidesDiv = document.createElement("div");
        slidesDiv.classList.add("slides");
        var scene = view.map;
        scene.then(function () {
            var _loop_1 = function (slide) {
                var slideDiv = document.createElement("div");
                slideDiv.style.backgroundImage = "url(\"" + slide.thumbnail.url + "\")";
                slideDiv.textContent = slide.title.text;
                slideDiv.addEventListener("click", function () {
                    var easing;
                    var select = document.getElementById("easingSelect");
                    easing = select.options[select.selectedIndex].value;
                    if (easing === "custom") {
                        easing = customEasingBounce;
                    }
                    var speedFactor = parseFloat(document.getElementById("speedFactorRange").value);
                    slide.applyTo(view, {
                        easing: easing,
                        speedFactor: speedFactor
                    });
                });
                slidesDiv.appendChild(slideDiv);
            };
            for (var _i = 0, _a = scene.presentation.slides.toArray(); _i < _a.length; _i++) {
                var slide = _a[_i];
                _loop_1(slide);
            }
        });
        view.container.appendChild(slidesDiv);
    }
    function createWidgets() {
        view.ui.add(widgets_1.add(view, "\n    <div>Speed factor: <input id=\"speedFactorRange\" type=\"range\" min=\"0.1\" max=\"10\" step=\"0.1\" value=\"1\"/></div>\n  "), "top-left");
        view.ui.add(widgets_1.add(view, "\n    <div>\n      Easing:\n      <select id=\"easingSelect\">\n        <option value=\"in-cubic\">In (in-cubic)</option>\n        <option value=\"out-cubic\">Out (out-cubic)</option>\n        <option value=\"in-out-cubic\" selected>In/out (in-out-cubic)</option>\n        <option value=\"out-expo\">Exponential out (out-expo)</option>\n        <option value=\"custom\">Custom</option>\n      </select>\n    </div>\n  "), "top-left");
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMDgtZ28tdG8tYW5pbWF0aW9uLW9wdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIwOC1nby10by1hbmltYXRpb24tb3B0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztJQVdBLElBQUksSUFBZSxDQUFDO0lBRXBCO1FBQ0UsVUFBVSxFQUFFLENBQUM7UUFDYixZQUFZLEVBQUUsQ0FBQztRQUNmLGFBQWEsRUFBRSxDQUFDO0lBQ2xCLENBQUM7SUFKRCxnQ0FJQztJQUVEO1FBQ0UsSUFBSSxHQUFHLElBQUksU0FBUyxDQUFDO1lBQ25CLFNBQVMsRUFBRSxTQUFTO1lBRXBCLEdBQUcsRUFBRSxJQUFJLFFBQVEsQ0FBQztnQkFDaEIsVUFBVSxFQUFFO29CQUNWLEVBQUUsRUFBRSxrQ0FBa0M7aUJBQ3ZDO2FBQ0YsQ0FBQztZQUVGLE9BQU8sRUFBRTtnQkFDUCxNQUFNLEVBQUUsR0FBRzthQUNMO1lBRVIsY0FBYyxFQUFFLE1BQU07WUFFdEIsV0FBVyxFQUFFO2dCQUNYLFVBQVUsRUFBRTtvQkFDVixPQUFPLEVBQUUsTUFBTTtpQkFDaEI7Z0JBRUQsUUFBUSxFQUFFO29CQUNSLG9CQUFvQixFQUFFLElBQUk7b0JBQzFCLHVCQUF1QixFQUFFLElBQUk7aUJBQzlCO2FBQ0Y7WUFFRCxFQUFFLEVBQUU7Z0JBQ0YsVUFBVSxFQUFFLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQzthQUNoQztTQUNULENBQUMsQ0FBQztRQUVILElBQU0sUUFBUSxHQUFHLDJCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXpDLDBCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXZCLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDeEIsQ0FBQztJQUVELDRCQUE0QixDQUFTO1FBQ25DLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2xGLENBQUM7SUFFRDtRQUNFLElBQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEQsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFbEMsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQWUsQ0FBQztRQUVuQyxLQUFLLENBQUMsSUFBSSxDQUFDO29DQUNFLEtBQUs7Z0JBQ2QsSUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDL0MsUUFBUSxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsV0FBUSxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsUUFBSSxDQUFDO2dCQUVqRSxRQUFRLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO2dCQUV4QyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFO29CQUNqQyxJQUFJLE1BQVcsQ0FBQztvQkFFaEIsSUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQXNCLENBQUM7b0JBQzVFLE1BQU0sR0FBSSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQXVCLENBQUMsS0FBSyxDQUFDO29CQUUzRSxFQUFFLENBQUMsQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQzt3QkFDeEIsTUFBTSxHQUFHLGtCQUFrQixDQUFDO29CQUM5QixDQUFDO29CQUVELElBQU0sV0FBVyxHQUFHLFVBQVUsQ0FBRSxRQUFRLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFzQixDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUV4RyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRTt3QkFDbEIsTUFBTSxRQUFBO3dCQUNOLFdBQVcsYUFBQTtxQkFDWixDQUFDLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsU0FBUyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNsQyxDQUFDO1lBekJELEdBQUcsQ0FBQyxDQUFnQixVQUFtQyxFQUFuQyxLQUFBLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFuQyxjQUFtQyxFQUFuQyxJQUFtQztnQkFBbEQsSUFBTSxLQUFLLFNBQUE7d0JBQUwsS0FBSzthQXlCZjtRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUYsSUFBSSxDQUFDLFNBQWlCLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRDtRQUNFLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLGFBQVMsQ0FBQyxJQUFJLEVBQUUsb0lBRTNCLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUVoQixJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxhQUFTLENBQUMsSUFBSSxFQUFFLG9hQVczQixDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDbEIsQ0FBQyJ9