import admin from 'firebase-admin'
import { helper } from 'afpk'

// Khởi tạo Firebase Admin SDK với thông tin xác thực của dự án
admin.initializeApp({
  credential: admin.credential.cert('./storage/harvard-af3b0-firebase-adminsdk-5iont-166971ea05.json'),
  databaseURL: 'https://harvard-af3b0.firebaseio.com'
});

// Lấy tham chiếu đến Firestore
export const db = admin.firestore()
export var indexCollections = {
  'device': 0,
}

const docIndexCollectionsRef = db.collection('config').doc('index-collections')

const updateIndexCollections = () => {
  docIndexCollectionsRef.set(indexCollections)
  .then(() => {
    helper.flog.log('db', 'Document written successfully!');
  })
  .catch((error) => {
    helper.flog.error('db', 'Error writing document: ', error);
  });
}

docIndexCollectionsRef.get()
.then((doc) => {
  let docData = doc.data()
  if (docData) {
    indexCollections = docData
  } else {
    updateIndexCollections()
  }
})