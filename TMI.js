class TMI {
  constructor() {
    const tmi = require("tmi.js");
    var AWS = require("./AWS/aws");
    this.aws = new AWS.AWS();

    const opts = {
      identity: {
        username: process.env.TWITCH_USER,
        password: process.env.TWITCH_KEY
      },
      channels: ["SeelenBacken", "MrFlax42"]
    };

    this.client = tmi.client(opts);
    this.client.on("connected", this.onConnectedHandler);
    this.client.on("join", this.onJoinHandler.bind(this));
    this.client.on("message", this.onMessageHandler.bind(this));

    this.cTimerList = new Map();

    this.client.connect();
  }

  onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
  }

  onMessageHandler(channel, user, msg, self) {
    if (self) {
      return;
    }
    var allowed;
    if (
      user["badges"]["broadcaster"] == 1 ||
      user["badges"]["moderator"] == 1
    ) {
      allowed = true;
    }
    let params = msg.slice(1).split(" ");
    let command = params.shift();
    if (command == "timer" && allowed) {
      if (params[0] == "add") {
        this.cTimerList.get(channel).add(this, channel, params);
      } else if (params[0] == "stop") {
        this.cTimerList.get(channel).stop(this, channel, params);
      } else if (params[0] == "stopall") {
        this.cTimerList.get(channel).stopall(this, channel);
      } else if (params[0] == "start") {
        this.cTimerList.get(channel).start(this, channel, params);
      } else if (params[0] == "remove") {
        this.cTimerList.get(channel).remove(this, channel, params);
      }
    } else if (command == "help") {
      this.client.say(channel, "NANANANANANANNANANANANA BATMAN");
    }
  }

  async onJoinHandler(channel, username, self) {
    if (self) {
      console.log("[TMI] Joined Channel " + channel);
      const timerList = this.aws.getTimer(channel.slice(1));
      var _this = this;

      timerList
        .then(function(value) {
          var Commands = require("./commands/Commands");
          _this.cTimerList.set(channel, new Commands.Timer(_this, value));
        })
        .catch(function(e) {
          console.log("[TMI] Timer - " + e);
        });
    }
  }
}

exports.TMI = TMI;
