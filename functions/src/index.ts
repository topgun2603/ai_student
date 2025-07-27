/* eslint-disable @typescript-eslint/no-explicit-any */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const getSchoolList = functions.https.onRequest(async (req, res) => {
    try {
        const snapshot = await db.collection("users").get();
        const schools = snapshot.docs
            .map(doc => {
                const data = doc.data();
                const name = data?.schoolProfile?.name;
                if (name) {
                    return {
                        id: doc.id,
                        name,
                    };
                }
                return null;
            })
            .filter(Boolean);

        res.status(200).json({ success: true, schools });
    } catch (error: any) {
        console.error("Error fetching schools:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

