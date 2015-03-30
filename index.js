module.exports = Throttler;

var async = require("async");

function Throttler(limit, asyncMethod, delay) {
    this.limit = limit;
    this.asyncMethod = asyncMethod || 'series';
    this.delay = delay || 1000;
    this.tasks = [];

    var timeoutId = null,
        lastCallback = null;


    /**
     * @param task A function with a callback ( to be used by require("async") )
     * @param callback Triggered when creating the task is completed, regardless of whether or not it processes.
     */
    this.addTask = function (task, callback) {
        lastCallback = callback;
        this.tasks.push(task);
        if (this.tasks.length >= this.limit) {
            this.process(callback);
        } else {
            reinitializeProcessingDelay.call(this);
            if (callback) callback();
        }
    };

    this.process = function (callback) {
        callback = callback || lastCallback;
        if (timeoutId) clearTimeout(timeoutId);
        async[this.asyncMethod](this.tasks, callback);
        this.tasks = [];
    };

    function reinitializeProcessingDelay() {
        var self = this;
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(function () {self.process(lastCallback);}, self.delay);
    }
}