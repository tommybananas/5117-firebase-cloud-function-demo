const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.countVotes = functions.firestore.document('votes/{name}')
  .onWrite((change, context) => {
    const statsRef = admin.firestore().doc('stats/votes');
    return admin.firestore().runTransaction(t => {
      return t.get(statsRef).then(votes => {
        const totals = votes.data() || {};

        // decrement previous choice
        if (change.before.data()) {
          const oldChoice = change.before.data().color;
          totals[oldChoice] = totals[oldChoice] ? totals[oldChoice] - 1 : 0;
        }

        // increment current choice
        if (change.after.data()) {
          const newChoice = change.after.data().color;
          totals[newChoice] = totals[newChoice] ? totals[newChoice] + 1 : 1;
        }

        // save new totals
        t.set(statsRef, totals);
      })
    })

  })
