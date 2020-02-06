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

  getTimer(channelName) {
    return new Promise((resolve, reject) => {
      var params = {
        TableName: "guardian",
        Key: {
          channelName: channelName
        }
      };
      this.docClient.get(params, function(err, data) {
        console.log('[AWS] Getting data...'.green);
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
            }
          });
        }
      })
    })
  }
}

exports.AWS = AWS;
exports.docClient = this.docClient;
