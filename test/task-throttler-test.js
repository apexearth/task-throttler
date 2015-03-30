require('should');
var Throttler = require("../index.js");

describe('Task Throttler Tests', function () {
    it('performs tasks when limit or duration hit', function (done) {
        var throttler = new Throttler(10, 'series', 50);
        var arr = [];

        var i = 15;
        var callbackCount = 0;
        while (i--) {
            throttler.addTask(function (callback) {
                arr.push(throttler.tasks.length);
                callback();
            }, function () {
                callbackCount++;

                // Although we're adding tasks, they are not running until we hit our limit or delay.
                if (arr.length < 10) {
                    arr.length.should.equal(0);
                }
                if (arr.length >= 10 && arr.length < 15) {
                    arr.length.should.equal(10);
                }

                // Once we have iterated 15 times, final processing is triggered after the delay (50ms) or by calling process().
                if (arr.length === 15) {
                    arr[0].should.equal(10);
                    arr[9].should.equal(10);
                    arr[14].should.equal(5);
                    callbackCount.should.equal(16);

                    console.log(arr);
                    done();
                }
            });
        }
        throttler.process(); // don't wait for the delay, process right away.
    });

    it('example usage also throttling task adding', function (done) {
        var throttler = new Throttler(10, 'series', 50);
        var arr = [];
        var callbackCount = 0;

        iterate(15);

        function iterate(count) {
            throttler.addTask(function (callback) {
                arr.push(throttler.tasks.length);
                callback();
            }, function () {
                callbackCount++;

                // Although we're adding tasks, they are not running until we hit our limit or delay.
                if (arr.length < 10) {
                    arr.length.should.equal(0);
                }
                if (arr.length >= 10 && arr.length < 15) {
                    arr.length.should.equal(10);
                }

                // Once we have iterated 15 times, final processing is triggered after the delay (50ms) or by calling process().
                if (arr.length === 15) {
                    arr[0].should.equal(10);
                    arr[9].should.equal(10);
                    arr[14].should.equal(5);
                    callbackCount.should.equal(16);

                    console.log(arr);
                    done();
                }

                if (count > 1) setTimeout(function () {iterate(count - 1); }, 1);
            });
        }

    });

});