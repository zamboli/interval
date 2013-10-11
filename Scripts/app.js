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
    
    var intervalID, i, j;
    $scope.intervals = Intervals;
    $scope.countNow = 0, $scope.intNumber = 0;
    $scope.status = "start";
    $scope.start = function() { 
        switch ($scope.status) {
            case "pause":
            
                //j = $scope.countNow, i = $scope.intNumber - 1;
                clearInterval(intervalID);
                $scope.status = "resume";
                console.log($scope.status);
                return false;
                break;

            case "start":

                i = 0, j = $scope.intervals[i].length;
                
            default:
                
                $scope.status = "pause";
                intervalID = setInterval(function() {
                    $scope.$apply(function(){
                        $scope.countNow = j;
                        $scope.intNumber = i + 1;
                        j--;
                        if (j < 1) { 
                            $timeout(play_multi_sound('gong'), 850);
                            i++; 
                            if (i  === $scope.intervals.length) {
                                clearInterval(intervalID); 
                                $timeout(function(){
                                    $scope.countNow = 0;
                                    $scope.intNumber = 0;
                                    $scope.status = "start";
                                } ,1000);
                                return false;
                            }
                            j = $scope.intervals[i].length; 
                        }
                        var now = +(new Date);
                        //    $scope.countNow = Math.round((now - start)/1000);
                    });
                }, 1000);
                intervalID;
                break;
        };
    };
    $scope.reset = function() {
        clearInterval(intervalID);
        $scope.status = "start";
        $scope.countNow = 0;
        $scope.intNumber = 0;
    };
};

myApp.controller(controllers);
