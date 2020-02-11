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
    });
  }

  start(client, channel, params) {
    if (this.timerMap.get(params[1])) {
      this.timerMap.get(params[1]).start();
    } else {
      this.client.say(channel, "This Timer does not exist");
    }
  }

  remove(client, channel, params) {
    if (this.timerMap.get(params[1])) {
      this.timerMap.get(params[1]).remove();
      this.timerMap.delete(params[1]);
    }
  }
}

class Command {
  constructor(client, channel, commandList) {
    this.client = client;
    this.commandList = commandList;
    this.commandMap = new Map();
    let _this = this;
    this.Command = require("./objects/Command");
    commandList.forEach(function(command) {
      _this.commandMap.set(
        command.commandName,
        new _this.Command.Command(client, channel, command.commandName, command.response)
      );
    });
  }

  add(channel, params) {
    let commandName = params[1];
    params.shift();
    params.shift();
    var newCommand = this.client.aws.addCommand(
      channel.slice(1),
      commandName,
      params.join(" ")
    );
    var _this = this;
    newCommand.then(function() {
      var nC = new _this.Command.Command(
        _this.client,
        channel.slice(1),
        commandName,
        params.join(" ")
      );
      _this.commandMap.set(commandName, nC);
    });
  }
  
  remove(channel, params) {
    if (this.commandMap.get(params[1])) {
      this.commandMap.get(params[1]).remove();
      this.commandMap.delete(params[1])
    }
  }
  
  print(channel, command) {
    if (this.commandMap.get(command)) {
      this.commandMap.get(command).print();
    }
  }
  
  contains(channel, commandName){
    if (this.commandMap.has(commandName)) {
      return true;
    } else {
      return false;
    }
  }
}

exports.Timer = Timer;
exports.Command = Command;
