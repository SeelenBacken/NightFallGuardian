class Timer {
  constructor(client, timerList) {
    this.client = client;
    this.timerList = timerList;
    this.timerMap = new Map();
    var _this = this;
    this.Timer = require("./objects/Timer");
    timerList.timer.forEach(function(time) {
      _this.timerMap.set(
        time.timerName,
        new _this.Timer.Timer(
          client,
          time.timerName,
          timerList.channelName,
          time.message,
          time.time,
          time.enabled
        )
      );
    });
    this.timerMap.forEach(function(time) {
      if (time.enabled) {
        time.start();
      }
    });
  }

  add(client, channel, params) {
    var timerName = params[1];
    var delay = params[2];
    params.shift();
    params.shift();
    params.shift();
    var newTimer = this.client.aws.addTimer(
      channel.slice(1),
      timerName,
      parseInt(delay),
      params.join(" ")
    );
    var _this = this;
    newTimer.then(function() {
      var nT = new _this.Timer.Timer(
        client,
        timerName,
        channel.slice(1),
        params.join(" "),
        parseInt(delay),
        true
      );
      _this.timerMap.set(timerName, nT);
      nT.start();
    });
  }

  stop(client, channel, params) {
    if (this.timerMap.get(params[1])) {
      this.timerMap.get(params[1]).stop();
    } else {
      client.client.say(channel, "This Timer does not exist");
    }
  }
  
  stopall(client, channel) {
    this.timerMap.forEach(function(timer) {
      timer.stop();
    })
  }
  
  start(client, channel, params) {
    if (this.timerMap.get(params[1])) {
      this.timerMap.get(params[1]).start();
    } else {
      this.client.say(channel, "This Timer does not exist");
    }
  }
  
  remove(client, channel, params){
    if (this.timerMap.get(params[1])) {
      this.timerMap.get(params[1]).remove();
      this.timerMap.delete(params[1]);
    }
  }
}
exports.Timer = Timer;
