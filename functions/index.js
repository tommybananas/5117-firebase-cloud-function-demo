const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const statsRef = admin.firestore().doc('stats/votes');

exports.countVotes = functions.firestore.document('votes/{name}')
  .onWrite((change, context) => {
    return admin.firestore().runTransaction(t => {
      return t.get(statsRef).then(votes => {
        const oldChoice = change.before.data() ? change.before.data().color : null;
        const newChoice = change.after.data().color;
        const newCount = votes.data() || {};
        const oldColorCount = newCount[newChoice] || 0;
        newCount[newChoice] = oldColorCount + 1;
        if (oldChoice) {
            newCount[oldChoice] = newCount[oldChoice] ? newCount[oldChoice] - 1 : 0;
        }
        t.set(statsRef, newCount);
      })
    })
  })