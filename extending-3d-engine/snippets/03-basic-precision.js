define(["require", "exports", "esri/Map", "esri/views/SceneView", "esri/views/3d/externalRenderers", "./support/webglUtils", "./support/log", "./support/widgets", "https://cdnjs.cloudflare.com/ajax/libs/gl-matrix/2.3.2/gl-matrix-min.js"], function (require, exports, Map, SceneView, externalRenderers, webglUtils_1, log, widgets_1, gl_matrix_min_js_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var view;
    var CustomRenderer = (function () {
        function CustomRenderer() {
            this.objects = [];
            this.useLocalOrigin = false;
        }
        CustomRenderer.prototype.setup = function (context) {
            var gl = context.gl;
            this.renderAt = null;
            this.initializeVertexBufferObject(context);
            this.initializeProgram(context);
        };
        CustomRenderer.prototype.render = function (context) {
            var gl = context.gl;
            var _a = this.program, program = _a.program, uniformLocations = _a.uniformLocations;
            var camera = context.camera, sunLight = context.sunLight;
            // Setup program and uniforms
            gl.useProgram(program);
            // Set camera view and projection matrices
            gl.uniformMatrix4fv(uniformLocations.uProjectionMatrix, false, camera.projectionMatrix);
            // Set lighting parameters
            gl.uniform3fv(uniformLocations.uDirectionalColor, this.intensityMultipliedColor(sunLight.diffuse));
            gl.uniform3fv(uniformLocations.uAmbientColor, this.intensityMultipliedColor(sunLight.ambient));
            gl.uniform3fv(uniformLocations.uLightingDirection, context.sunLight.direction);
            // Bind vertex buffer object and setup attribute pointers
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
            gl.enableVertexAttribArray(this.vertexPositionAttributeLocation);
            gl.enableVertexAttribArray(this.vertexNormalAttributeLocation);
            // Vertex position
            gl.vertexAttribPointer(this.vertexPositionAttributeLocation, 3, gl.FLOAT, false, 24, 0);
            // Vertex normal
            gl.vertexAttribPointer(this.vertexNormalAttributeLocation, 3, gl.FLOAT, false, 24, 12);
            gl.disable(gl.BLEND);
            gl.enable(gl.DEPTH_TEST);
            for (var _i = 0, _b = this.objects; _i < _b.length; _i++) {
                var object = _b[_i];
                var viewMatrix = gl_matrix_min_js_1.mat4.translate(new Array(16), camera.viewMatrix, object.origin);
                gl.uniformMatrix4fv(uniformLocations.uViewMatrix, false, viewMatrix);
                gl.uniformMatrix4fv(uniformLocations.uModelMatrix, false, object.modelMatrix);
                gl.uniformMatrix3fv(uniformLocations.uNormalMatrix, false, object.normalMatrix);
                gl.drawArrays(gl.TRIANGLES, 0, 36);
            }
            // Make sure to reset the WebGL state when finishing the render
            context.resetWebGLState();
        };
        CustomRenderer.prototype.add = function (point) {
            if (!point) {
                return;
            }
            var origin = this.useLocalOrigin ? [3867591.281442831, 385734.3844961442, 5057029.372984918] : [0, 0, 0];
            var modelMatrix = externalRenderers.renderCoordinateTransformAt(view, [point.x, point.y, point.z], point.spatialReference, null);
            // Subtract local origin from the modelMatrix
            modelMatrix[12] -= origin[0];
            modelMatrix[13] -= origin[1];
            modelMatrix[14] -= origin[2];
            this.objects.push({
                origin: origin,
                modelMatrix: modelMatrix,
                normalMatrix: gl_matrix_min_js_1.mat3.normalFromMat4(new Array(9), modelMatrix)
            });
            externalRenderers.requestRender(view);
            log.timeout("Added new cube");
        };
        CustomRenderer.prototype.intensityMultipliedColor = function (colorDef) {
            var color = colorDef.color, intensity = colorDef.intensity;
            return [
                color[0] * intensity,
                color[1] * intensity,
                color[2] * intensity
            ];
        };
        CustomRenderer.prototype.initializeVertexBufferObject = function (context) {
            var gl = context.gl;
            this.vbo = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
            gl.bufferData(gl.ARRAY_BUFFER, webglUtils_1.createCubeGeometry(2), gl.STATIC_DRAW);
        };
        CustomRenderer.prototype.initializeProgram = function (context) {
            var gl = context.gl;
            this.program = webglUtils_1.createProgram(gl, "render", 
            // Vertex shader
            "\n        precision highp float;\n\n        attribute vec3 aVertexPosition;\n        attribute vec3 aVertexNormal;\n\n        uniform mat4 uModelMatrix;\n        uniform mat4 uViewMatrix;\n        uniform mat4 uProjectionMatrix;\n        uniform mat3 uNormalMatrix;\n\n        uniform vec3 uAmbientColor;\n        uniform vec3 uLightingDirection;\n        uniform vec3 uDirectionalColor;\n\n        varying vec3 vLightColor;\n\n        void main(void) {\n          gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);\n          vec3 transformedNormal = normalize(uNormalMatrix * aVertexNormal);\n\n          float directionalLightWeighting = max(dot(transformedNormal, uLightingDirection), 0.0);\n          vLightColor = uAmbientColor + uDirectionalColor * directionalLightWeighting;\n        }\n      ", 
            // Fragment shader
            "\n        precision highp float;\n\n        varying vec3 vLightColor;\n\n        void main() {\n          gl_FragColor = vec4(vLightColor, 1);\n        }\n      ", 
            // Uniform names
            ["uModelMatrix", "uViewMatrix", "uProjectionMatrix", "uNormalMatrix", "uDirectionalColor", "uAmbientColor", "uLightingDirection"]);
            this.vertexPositionAttributeLocation = gl.getAttribLocation(this.program.program, "aVertexPosition");
            this.vertexNormalAttributeLocation = gl.getAttribLocation(this.program.program, "aVertexNormal");
        };
        return CustomRenderer;
    }());
    var renderer;
    function initialize() {
        view = new SceneView({
            container: "viewDiv",
            map: new Map({
                basemap: "satellite",
                ground: "world-elevation"
            }),
            camera: {
                position: [5.694, 52.453, 85.24],
                heading: 32.06,
                tilt: 66.08
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
                components: ["compass"]
            }
        });
        widgets_1.createOverviewMap(view);
        widgets_1.createFullscreen(view);
        view.then(function () {
            // Create the custom renderer and add it to the view
            renderer = new CustomRenderer();
            externalRenderers.add(view, renderer);
            view.on("hold", function (event) {
                renderer.add(event.mapPoint);
            });
            widgets_1.add(view, "<div><input type=\"checkbox\"> Enable local origins</div>", {
                click: function (event) {
                    renderer.useLocalOrigin = event.target.checked;
                }
            });
        });
        window["view"] = view;
    }
    exports.initialize = initialize;
    function play() {
    }
    exports.play = play;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMDMtYmFzaWMtcHJlY2lzaW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiMDMtYmFzaWMtcHJlY2lzaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0lBcUJBLElBQUksSUFBZSxDQUFDO0lBRXBCO1FBQUE7WUFRVSxZQUFPLEdBSVQsRUFBRSxDQUFDO1lBRVQsbUJBQWMsR0FBRyxLQUFLLENBQUM7UUFxSnpCLENBQUM7UUFuSkMsOEJBQUssR0FBTCxVQUFNLE9BQTJCO1lBQy9CLElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFFdEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7WUFFckIsSUFBSSxDQUFDLDRCQUE0QixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzNDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBRUQsK0JBQU0sR0FBTixVQUFPLE9BQTJCO1lBQ2hDLElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFFaEIsSUFBQSxpQkFBNEMsRUFBMUMsb0JBQU8sRUFBRSxzQ0FBZ0IsQ0FBa0I7WUFDM0MsSUFBQSx1QkFBTSxFQUFFLDJCQUFRLENBQWE7WUFFckMsNkJBQTZCO1lBQzdCLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFdkIsMENBQTBDO1lBQzFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFFeEYsMEJBQTBCO1lBQzFCLEVBQUUsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ25HLEVBQUUsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUMvRixFQUFFLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFL0UseURBQXlEO1lBQ3pELEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFekMsRUFBRSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1lBQ2pFLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsQ0FBQztZQUUvRCxrQkFBa0I7WUFDbEIsRUFBRSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQywrQkFBK0IsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBRXhGLGdCQUFnQjtZQUNoQixFQUFFLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLDZCQUE2QixFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFdkYsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDckIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFekIsR0FBRyxDQUFDLENBQWlCLFVBQVksRUFBWixLQUFBLElBQUksQ0FBQyxPQUFPLEVBQVosY0FBWSxFQUFaLElBQVk7Z0JBQTVCLElBQU0sTUFBTSxTQUFBO2dCQUNmLElBQU0sVUFBVSxHQUFHLHVCQUFJLENBQUMsU0FBUyxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBUSxFQUFFLE1BQU0sQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUUxRixFQUFFLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFDckUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUM5RSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBRWhGLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7YUFDcEM7WUFFRCwrREFBK0Q7WUFDL0QsT0FBTyxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQzVCLENBQUM7UUFFRCw0QkFBRyxHQUFILFVBQUksS0FBaUI7WUFDbkIsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNYLE1BQU0sQ0FBQztZQUNULENBQUM7WUFFRCxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsaUJBQWlCLEVBQUUsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDM0csSUFBTSxXQUFXLEdBQUcsaUJBQWlCLENBQUMsMkJBQTJCLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFbkksNkNBQTZDO1lBQzdDLFdBQVcsQ0FBQyxFQUFFLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsV0FBVyxDQUFDLEVBQUUsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QixXQUFXLENBQUMsRUFBRSxDQUFDLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTdCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO2dCQUNoQixNQUFNLFFBQUE7Z0JBQ04sV0FBVyxhQUFBO2dCQUNYLFlBQVksRUFBRSx1QkFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQVEsRUFBRSxXQUFrQixDQUFRO2FBQ2xGLENBQUMsQ0FBQztZQUVILGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUV0QyxHQUFHLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDaEMsQ0FBQztRQUVPLGlEQUF3QixHQUFoQyxVQUFpQyxRQUFhO1lBQ3BDLElBQUEsc0JBQUssRUFBRSw4QkFBUyxDQUFjO1lBRXRDLE1BQU0sQ0FBQztnQkFDTCxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUztnQkFDcEIsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVM7Z0JBQ3BCLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTO2FBQ3JCLENBQUM7UUFDSixDQUFDO1FBRU8scURBQTRCLEdBQXBDLFVBQXFDLE9BQTJCO1lBQzlELElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFFdEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7WUFFN0IsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN6QyxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsK0JBQWtCLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3hFLENBQUM7UUFFTywwQ0FBaUIsR0FBekIsVUFBMEIsT0FBMkI7WUFDbkQsSUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUV0QixJQUFJLENBQUMsT0FBTyxHQUFHLDBCQUFhLENBQUMsRUFBRSxFQUFFLFFBQVE7WUFDdkMsZ0JBQWdCO1lBQ2hCLDIwQkF3QkM7WUFFRCxrQkFBa0I7WUFDbEIsbUtBUUM7WUFFRCxnQkFBZ0I7WUFDaEIsQ0FBQyxjQUFjLEVBQUUsYUFBYSxFQUFFLG1CQUFtQixFQUFFLGVBQWUsRUFBRSxtQkFBbUIsRUFBRSxlQUFlLEVBQUUsb0JBQW9CLENBQUMsQ0FDbEksQ0FBQztZQUVGLElBQUksQ0FBQywrQkFBK0IsR0FBRyxFQUFFLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztZQUNyRyxJQUFJLENBQUMsNkJBQTZCLEdBQUcsRUFBRSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQ25HLENBQUM7UUFDSCxxQkFBQztJQUFELENBQUMsQUFuS0QsSUFtS0M7SUFFRCxJQUFJLFFBQXdCLENBQUM7SUFFN0I7UUFDRSxJQUFJLEdBQUcsSUFBSSxTQUFTLENBQUM7WUFDbkIsU0FBUyxFQUFFLFNBQVM7WUFFcEIsR0FBRyxFQUFFLElBQUksR0FBRyxDQUFDO2dCQUNYLE9BQU8sRUFBRSxXQUFXO2dCQUNwQixNQUFNLEVBQUUsaUJBQWlCO2FBQzFCLENBQUM7WUFFRixNQUFNLEVBQUU7Z0JBQ04sUUFBUSxFQUFFLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUM7Z0JBQ2hDLE9BQU8sRUFBRSxLQUFLO2dCQUNkLElBQUksRUFBRSxLQUFLO2FBQ1o7WUFFRCxjQUFjLEVBQUUsTUFBTTtZQUV0QixXQUFXLEVBQUU7Z0JBQ1gsVUFBVSxFQUFFO29CQUNWLE9BQU8sRUFBRSxNQUFNO2lCQUNoQjtnQkFFRCxRQUFRLEVBQUU7b0JBQ1Isb0JBQW9CLEVBQUUsSUFBSTtvQkFDMUIsdUJBQXVCLEVBQUUsSUFBSTtpQkFDOUI7YUFDRjtZQUVELEVBQUUsRUFBRTtnQkFDRixVQUFVLEVBQUUsQ0FBQyxTQUFTLENBQUM7YUFDakI7U0FDVCxDQUFDLENBQUM7UUFFSCwyQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4QiwwQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV2QixJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ1Isb0RBQW9EO1lBQ3BELFFBQVEsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1lBQ2hDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFFdEMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBQyxLQUFVO2dCQUN6QixRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMvQixDQUFDLENBQUMsQ0FBQztZQUVILGFBQVMsQ0FBQyxJQUFJLEVBQUUsMkRBQXlELEVBQUU7Z0JBQ3pFLEtBQUssRUFBRSxVQUFDLEtBQVU7b0JBQ2hCLFFBQVEsQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7Z0JBQ2pELENBQUM7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDeEIsQ0FBQztJQXJERCxnQ0FxREM7SUFFRDtJQUNBLENBQUM7SUFERCxvQkFDQyJ9