define(["require", "exports", "esri/Map", "esri/views/MapView"], function (require, exports, Map, MapView) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function createFullscreen(view) {
        var fullscreen = document.createElement("div");
        fullscreen.classList.add("esri-button", "esri-widget-button", "esri-interactive");
        var span = document.createElement("span");
        span.classList.add("esri-icon", "esri-icon-zoom-out-fixed");
        fullscreen.appendChild(span);
        view.ui.add(fullscreen, "top-left");
        fullscreen.addEventListener("click", function () {
            parent.postMessage({ type: "fullscreen" }, "*");
        });
    }
    exports.createFullscreen = createFullscreen;
    function createOverviewMap(view) {
        var div = document.createElement("div");
        div.setAttribute("id", "overviewDiv");
        view.container.appendChild(div);
        var mapView = new MapView({
            map: new Map({
                basemap: "streets-night-vector"
            }),
            container: div,
            ui: {
                components: []
            },
            constraints: {
                snapToZoom: false
            }
        });
        var handle = view.watch("extent", function (extent) {
            mapView.extent = extent;
        });
        return {
            view: mapView,
            remove: function () {
                handle.remove();
                mapView.container = null;
                mapView.destroy();
                if (div.parentElement) {
                    div.parentElement.removeChild(div);
                }
            }
        };
    }
    exports.createOverviewMap = createOverviewMap;
    var addElementDiv = document.createElement("div");
    function add(view, html, eventHandlers) {
        addElementDiv.innerHTML = html;
        var elem = addElementDiv.children[0];
        addElementDiv.innerHTML = "";
        elem.classList.add("text-on-view");
        view.ui.add(elem, "top-left");
        if (eventHandlers) {
            for (var eventName in eventHandlers) {
                elem.addEventListener(eventName, eventHandlers[eventName]);
            }
        }
        return elem;
    }
    exports.add = add;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2lkZ2V0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIndpZGdldHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7SUFRQSwwQkFBaUMsSUFBb0I7UUFDbkQsSUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqRCxVQUFVLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsb0JBQW9CLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUVsRixJQUFNLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO1FBRTVELFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRXBDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUU7WUFDbkMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNsRCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFiRCw0Q0FhQztJQUVELDJCQUFrQyxJQUFvQjtRQUNwRCxJQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBRXJDLElBQUksQ0FBQyxTQUFpQixDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUV6QyxJQUFNLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQztZQUMxQixHQUFHLEVBQUUsSUFBSSxHQUFHLENBQUM7Z0JBQ1gsT0FBTyxFQUFFLHNCQUFzQjthQUNoQyxDQUFDO1lBRUYsU0FBUyxFQUFFLEdBQVU7WUFFckIsRUFBRSxFQUFFO2dCQUNGLFVBQVUsRUFBRSxFQUFFO2FBQ1I7WUFFUixXQUFXLEVBQUU7Z0JBQ1gsVUFBVSxFQUFFLEtBQUs7YUFDbEI7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxVQUFDLE1BQW1CO1lBQ3RELE9BQU8sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQzFCLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDO1lBQ0wsSUFBSSxFQUFFLE9BQU87WUFFYixNQUFNLEVBQUU7Z0JBQ04sTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUVoQixPQUFPLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztnQkFDekIsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUVsQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztvQkFDdEIsR0FBRyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3JDLENBQUM7WUFDSCxDQUFDO1NBQ0YsQ0FBQztJQUNKLENBQUM7SUF4Q0QsOENBd0NDO0lBRUQsSUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUVwRCxhQUFvQixJQUFvQixFQUFFLElBQVksRUFBRSxhQUF1RDtRQUM3RyxhQUFhLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUMvQixJQUFNLElBQUksR0FBRyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBZ0IsQ0FBQztRQUN0RCxhQUFhLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUU3QixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNuQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFOUIsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUNsQixHQUFHLENBQUMsQ0FBQyxJQUFNLFNBQVMsSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQzdELENBQUM7UUFDSCxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFmRCxrQkFlQyJ9