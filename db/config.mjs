import { MongoDb } from "afpk"

import __config from './../config/index.mjs'

const mongo = new MongoDb(__config.mongodb.uri);

export function getId(tb_name) {
  let db = mongo.client.db('db_af')
  let coll = db.collection("tb_ids")

  return new Promise((resolve, reject) => {
    coll.findOneAndUpdate({ name: tb_name }, { $inc: { val: 1 } }, { returnDocument: 'after' })
    .then(data => {
      if (data === null) {
        coll.insertOne({ name: tb_name, val: 1 })
        .then(() => {
          resolve(1)
        })
        .catch(reject)
      } else {
        resolve(data.val)
      }
    })
    .catch(reject)
  })
}

export default mongo;
