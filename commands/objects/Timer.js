class Timer{
  constructor(client, timerName, channel, message, delay, enabled) {
    this.client = client.client;
    this.timerName = timerName;
    this.channelName = channel;
    this.message = message;
    this.delay = delay;
    this.enabled = enabled;
    this.aws = client.aws;
  }
  
  start() {
    var _this = this;
    this.enabled = true;
    this.aws.updateTimer(this.channelName, this.timerName, { enabled: true });
    _this.interval = setInterval(function() {
      _this.client.say(_this.channelName, _this.message);
      console.log(
        "[TMI] (" + _this.channelName + ") Sending " + _this.timerName
      );
    }, _this.delay);
  }
  
  stop() {
    clearInterval(this.interval);
    this.enabled = false;
    this.aws.updateTimer(this.channelName, this.timerName, { enabled: false });
  }
  
  update(options) {
    if (options.timerName) {
      this.timerName = options.timerName;
    }
    if (options.message) {
      this.message = options.message;
    }
    if (options.delay) {
      this.delay = options.delay;
    }
  }
  
  remove() {
    clearInterval(this.interval);
    this.aws.removeTimer(this.channelName, this.timerName);
  }
  
  test() {
    console.log(this.timerName + ": Testing");
  }
}

exports.Timer = Timer;
