const webhook = require("webhook-discord");
const Hook = new webhook.Webhook(
  "https://discordapp.com/api/webhooks/675310404276322334/Qa1JrQ5tkICzIdWojjTsuh31vNN1PAtlzVhA93Zwcd3mt5SuMQkU2uVUXR07jgD7zR9z"
);
const msg = new webhook.MessageBuilder()
  .setName("NightFall Guardian")
  .setText("This is a Test")
  .addField("This", "is a field")
  .setTime();

//Hook.send(msg);

var TMI = require("./TMI");
var tmi = new TMI.TMI();
