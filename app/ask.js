const uuid = require('uuid/v1');
const dialogflow = require('dialogflow');
const config = require('./config');
const Records = require('./records');

const language = 'en-US';
const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath(config.aiProjectId, uuid());

exports.getIntent = async (text) => {
  try {
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text,
          languageCode: language,
        },
      },
    };

    const res = await sessionClient.detectIntent(request);
    const result = res[0].queryResult;
    console.log(result);
    if (result.action === 'input.unknown') {
      const newRecord = new Records({
        name: 'User',
        message: result.queryText,
      });
      newRecord.save();
    }
    if (result.intent) {
      if (result.intent.displayName === 'Messages') {
        const recordsCount = await Records.countDocuments({ readFlag: false });
        console.log(recordsCount);
        if (!recordsCount) { return 'There is no call recorded right now!'; }
        const messageText = (recordsCount > 1) ? 'messages' : 'message';
        return `Yes i got ${recordsCount} ${messageText} for you`;
      }

      if (result.intent.displayName === 'Reader') {
        const records = await Records.find({ readFlag: false });
        if (!records.length) { return 'There is no message to read'; }
        const messages = records.map(r => r.message);
        const message = (messages.length > 1) ? messages.join(' and the another message is ') : messages[0];
        // update all the readFlag after read
        Records.update(
          { readFlag: false },
          { $set: { readFlag: true } },
          { multi: true },
        ).then(() => console.log('all messages got read'));
        return message;
      }
      console.log(`Intent: ${result.intent.displayName}`);
    } else {
      console.log('No intent matched');
      return 'no intent matched, please try again';
    }
    return result.fulfillmentText;
  } catch (err) {
    console.log(JSON.stringify(err));
    console.error(err);
    return 'Some thing went wrong!';
  }
};
