define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function message() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var message = Array.prototype.join.call(args, " ");
        var viewLog = document.getElementById("viewLog");
        viewLog.textContent = message;
    }
    exports.message = message;
    ;
    var timeoutHandle = 0;
    function timeout() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        message.apply(void 0, args);
        if (timeoutHandle) {
            clearTimeout(timeoutHandle);
        }
        timeoutHandle = setTimeout(function () {
            timeoutHandle = 0;
            message("");
        }, 2000);
    }
    exports.timeout = timeout;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0lBQUE7UUFBd0IsY0FBYzthQUFkLFVBQWMsRUFBZCxxQkFBYyxFQUFkLElBQWM7WUFBZCx5QkFBYzs7UUFDcEMsSUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNyRCxJQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRW5ELE9BQU8sQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDO0lBQ2hDLENBQUM7SUFMRCwwQkFLQztJQUFBLENBQUM7SUFFRixJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUM7SUFFdEI7UUFBd0IsY0FBYzthQUFkLFVBQWMsRUFBZCxxQkFBYyxFQUFkLElBQWM7WUFBZCx5QkFBYzs7UUFDcEMsT0FBTyxlQUFJLElBQUksRUFBRTtRQUVqQixFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUM5QixDQUFDO1FBRUQsYUFBYSxHQUFHLFVBQVUsQ0FBQztZQUN6QixhQUFhLEdBQUcsQ0FBQyxDQUFDO1lBQ2xCLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNkLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNYLENBQUM7SUFYRCwwQkFXQyJ9