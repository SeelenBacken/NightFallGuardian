class Command{
  constructor(client, channelName, commandName, response){
    this.client = client.client;
    this.aws = client.aws;
    this.channelName = channelName;
    this.commandName = commandName;
    this.response = response;
  }
  
  update(response) {
    this.response = response;
  }
  
  remove() {
    this.aws.removeCommand(this.channelName, this.commandName);
  }
  
  print() {
    this.client.say(this.channelName, this.response);
  }
}

exports.Command = Command;