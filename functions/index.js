const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.cleanupOldBills = functions.pubsub
    .schedule("every 24 hours")
    .onRun(async () => {

        const db = admin.firestore();
        const now = Date.now();
        const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

        const snapshot = await db
            .collection("bills")
            .where("timestamp", "<", sevenDaysAgo)
            .get();

        if (snapshot.empty) return null;

        const batch = db.batch();

        snapshot.forEach(doc => {
            batch.delete(doc.ref);
        });

        await batch.commit();
        console.log(`Deleted ${snapshot.size} old bills`);

        return null;
    });
