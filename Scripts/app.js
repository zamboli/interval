var myApp = angular.module('myModule', []);

myApp.factory('Intervals', function() {
    intervals = [];
    return intervals;
});

var controllers = {};

controllers.SimpleController = function ($scope, Intervals) {
    $scope.intervals = Intervals; 
    $scope.addInterval = function () {
    	$scope.intervals.push({ length: $scope.newInterval.length})
    };

    $scope.removeInterval = function(index) {
        $scope.intervals.splice(index, 1);
    };

};

controllers.timeMaster = function ($scope, $timeout, Intervals) {
    //set timeout 10 second function: get time
    //note to self:make more comment

    var timers = {
        timerID: 0,
        timers: [],
        
        add: function(fn) {
            this.timers.push(fn);
        },

        start: function() {
            if (this.timerID) return;
            (function() {
                if (timers.timers.length > 0) {
                    for (var i = 0; i < timers.timers.length; i++) {
                        if (timers.timers[i]() === false) {
                            timers.timers.splice(i,1);
                            i--;
                        }
                    }
                timers.timerID = $timeout(arguments.callee, 1000);
                }
            })();
        },

        stop: function() {
            clearTimeout(this.timerID);
            this.timerID = 0;
        }
    };

    // audio 
    var channel_max = 10;	// number of channels
    audiochannels = new Array();
    for (a=0;a<channel_max;a++) {    // prepare the channels
        audiochannels[a] = new Array();
        audiochannels[a]['channel'] = new Audio();	// create a new audio object
        audiochannels[a]['finished'] = -1;	// expected end time for this channel
    }
    function play_multi_sound(s) {
        for (a=0;a<audiochannels.length;a++) {
            thistime = new Date();
            if (audiochannels[a]['finished'] < thistime.getTime()) {// is this channel finished?
                audiochannels[a]['finished'] = thistime.getTime() + document.getElementById(s).duration*1000;
                audiochannels[a]['channel'].src = document.getElementById(s).src;
                audiochannels[a]['channel'].load();
                audiochannels[a]['channel'].play();
                break;
            }
        }
    }
    
    $scope.intervals = Intervals;
    $scope.countNow = 0, $scope.intNumber = 0;
    $scope.start = function() { 
        /*timers.stop();
        //$scope.intNumber = 0;
        //$scope.countNow = $scope.intervals[0].length;
        var i = 0;
        var j = $scope.intervals[i].length;
	timers.add( function() {
            $scope.countNow = j;
	        $scope.intNumber = i + 1;
            j--;
            if (j < 0) { 
                play_multi_sound('gong');
                i++; 
                if (i  === $scope.intervals.length) return false;
                j = $scope.intervals[i].length; 
	        }
         });
         timers.start(); */
	    var start = +(new Date), i = 0, j = $scope.intervals[i].length;
	    var intervalID = window.setInterval(function() {
	    	$scope.$apply(function(){
                $scope.countNow = j;
                $scope.intNumber = i + 1;
                j--;
                if (j < 0) { 
                    play_multi_sound('gong');
                    i++; 
                    if (i  === $scope.intervals.length) {
                        window.clearInterval(intervalID); 
                        $scope.intNumber = 0; 
                        return false;
                    }
                    j = $scope.intervals[i].length; 
                }
	        		var now = +(new Date);
                //    $scope.countNow = Math.round((now - start)/1000);
                console.log("i");
	    	});
	    }, 1000);
        intervalID();
    };
};

myApp.controller(controllers);
