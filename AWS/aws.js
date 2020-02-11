/*
  Modul zum interagieren mit der AWS Datenbank.
*/
class AWS {
  constructor() {
    var AWS = require("aws-sdk");
    var colors = require("colors");
    this.consts = require("./const");
    AWS.config.update({
      region: "eu-central-1",
      endpoint: "https://dynamodb.eu-central-1.amazonaws.com",
      accessKeyId: process.env.AWS_ACCESS_ID,
      secretAccessKey: process.env.AWS_ACCESS_SECRET
    });

    this.docClient = new AWS.DynamoDB.DocumentClient();
  }

//-------------------------- Timer -------------------------------
  getTimer(channelName) {
    return new Promise((resolve, reject) => {
      var params = {
        TableName: "guardian",
        Key: {
          channelName: channelName
        }
      };
      this.docClient.get(params, function(err, data) {
        console.log("[AWS] Getting timer data...".green);
        if (err) {
          reject(Error(err));
        } else {
          if (data.Item) {
            resolve(data.Item);
          } else {
            reject(Error("No Timer found"));
          }
        }
      });
    });
  }

  addTimer(channelName, timerName, delay, message) {
    return new Promise((resolve, reject) => {
      var params = {
        TableName: "guardian",
        Key: {
          channelName: channelName
        }
      };
      var docClient = this.docClient;
      this.docClient.get(params, function(err, data) {
        if (err) {
          reject(Error(err));
        } else {
          var timerOld = data.Item.timer;
          var newTimer = {
            enabled: true,
            message: message,
            time: delay,
            timerName: timerName
          };
          timerOld.push(newTimer);

          params = {
            TableName: "guardian",
            Key: {
              channelName: channelName
            },
            UpdateExpression: "set timer = :t",
            ExpressionAttributeValues: {
              ":t": timerOld
            },
            ReturnValues: "UPDATED_NEW"
          };

          docClient.update(params, function(err, data) {
            if (err) {
              reject(Error(err));
            } else {
              resolve(data);
            }
          });
        }
      });
    });
  }

  updateTimer(channelName, timerName, options) {
    return new Promise((resolve, reject) => {
      var params = {
        TableName: "guardian",
        Key: {
          channelName: channelName
        }
      };
      var docClient = this.docClient;
      this.docClient.get(params, function(err, data) {
        if (err) {
          reject(Error(err));
        } else {
          var timerOld = data.Item.timer;
          var tIndex;
          var cTimer;
          timerOld.forEach(function(time) {
            if (time.timerName == timerName) {
              tIndex = timerOld.indexOf(time);
              cTimer = {
                enabled: time.enabled,
                message: time.message,
                time: time.time,
                timerName: time.timerName
              };
              if (options.timerName) {
                cTimer.timerName = options.timerName;
              }
              if (options.message) {
                cTimer.message = options.message;
              }
              if (options.delay) {
                cTimer.time = options.delay;
              }
              if (options.enabled !== undefined) {
                cTimer.enabled = options.enabled;
              }
            }
          });
          timerOld[tIndex] = cTimer;
          params = {
            TableName: "guardian",
            Key: {
              channelName: channelName
            },
            UpdateExpression: "set timer = :t",
            ExpressionAttributeValues: {
              ":t": timerOld
            },
            ReturnValues: "UPDATED_NEW"
          };
          docClient.update(params, function(err, data) {
            if (err) {
              reject(Error(err));
            } else {
              console.log("[AWS] Timer " + timerName + " updated");
            }
          });
        }
      });
    });
  }

  removeTimer(channelName, timerName) {
    return new Promise((resolve, reject) => {
      var params = {
        TableName: "guardian",
        Key: {
          channelName: channelName
        }
      };
      let docClient = this.docClient;
      this.docClient.get(params, function(err, data) {
        if (err) {
          reject(Error(err));
        } else {
          var timerOld = data.Item.timer;
          let toRemove;
          timerOld.forEach(function(time) {
            if (time.timerName == timerName) {
              toRemove = timerOld.indexOf(time);
            }
          });
          timerOld.splice(toRemove, 1);
          params = {
            TableName: "guardian",
            Key: {
              channelName: channelName
            },
            UpdateExpression: "set timer = :t",
            ExpressionAttributeValues: {
              ":t": timerOld
            },
            ReturnValues: "UPDATED_NEW"
          };
          docClient.update(params, function(err, data) {
            if (err) {
              reject(Error(err));
            } else {
              console.log("[AWS] Timer " + timerName + " updated");
              resolve(data);
            }
          });
        }
      });
    });
  }

  
//------------------------- Commands --------------------------ö
  addCommand(channelName, commandName, response) {
    return new Promise((resolve, reject) => {
      var params = {
        TableName: "guardian",
        Key: {
          channelName: channelName
        }
      };
      var docClient = this.docClient;
      docClient.get(params, function(err, data) {
        if (err) {
          reject(Error(err));
        } else {
          var commandsOld = data.Item.commands;
          var newCommand = {
            commandName: commandName,
            response: response
          };
          commandsOld.push(newCommand);

          params = {
            TableName: "guardian",
            Key: {
              channelName: channelName
            },
            UpdateExpression: "set commands = :t",
            ExpressionAttributeValues: {
              ":t": commandsOld
            },
            ReturnValues: "UPDATED_NEW"
          };

          docClient.update(params, function(err, data) {
            if (err) {
              reject(Error(err));
            } else {
              resolve(data);
            }
          });
        }
      });
    });
  }

  getCommands(channelName) {
    return new Promise((resolve, reject) => {
      var params = {
        TableName: "guardian",
        Key: {
          channelName: channelName
        }
      };
      this.docClient.get(params, function(err, data) {
        console.log("[AWS] Getting command data...".green);
        if (err) {
          reject(Error(err));
        } else {
          if (data.Item.commands) {
            resolve(data.Item.commands);
          } else {
            reject(Error("No Commands found"));
          }
        }
      });
    });
  }

  updateCommand(channelName, commandName, response) {
    return new Promise((resolve, reject) => {
      var params = {
        TableName: "guardian",
        Key: {
          channelName: channelName
        }
      };
      var docClient = this.docClient;
      docClient.get(params, function(err, data) {
        if (err) {
          reject(Error(err));
        } else {
          var commandsOld = data.Item.commands;
          let cIndex;
          let cCommand;
          commandsOld.forEach(function(command) {
            if (command.commandName == commandName) {
              cIndex = commandsOld.indexOf(command);
              cCommand = {
                commandName: commandName,
                response: response
              };
            }
          });
          commandsOld[cIndex] = cCommand;
          params = {
            TableName: "guardian",
            Key: {
              channelName: channelName
            },
            UpdateExpression: "set commands = :t",
            ExpressionAttributeValues: {
              ":t": commandsOld
            },
            ReturnValues: "UPDATED_NEW"
          };
          docClient.update(params, function(err, data) {
            if (err) {
              reject(Error(err));
            } else {
              console.log("[AWS] Command " + commandName + " updated");
            }
          });
        }
      });
    });
  }
  
  removeCommand(channelName, commandName) {
    return new Promise((resolve, reject) => {
      var params = {
        TableName: "guardian",
        Key: {
          channelName: channelName
        }
      };
      console.log(params);
      let docClient = this.docClient;
      docClient.get(params, function(err, data) {
        if (err) {
          reject(Error(err));
        } else {
          console.log(data);
          var commandsOld = data.Item.commands;
          let toRemove;
          commandsOld.forEach(function(command) {
            if (command.commandName == commandName) {
              toRemove = commandsOld.indexOf(command);
            }
          });
          commandsOld.splice(toRemove, 1);
          params = {
            TableName: "guardian",
            Key: {
              channelName: channelName
            },
            UpdateExpression: "set commands = :c",
            ExpressionAttributeValues: {
              ":c": commandsOld
            },
            ReturnValues: "UPDATED_NEW"
          };
          docClient.update(params, function(err, data) {
            if (err) {
              reject(Error(err));
            } else {
              console.log("[AWS] Command " + commandName + " removed");
              resolve(data);
            }
          })
        }
      })
    })
  }
}

exports.AWS = AWS;
exports.docClient = this.docClient;
