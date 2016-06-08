import Coll from '../collection.js';

if (Coll.find().count() == 0) {
    for (var i = 0; i < 1000; i++) {
        Coll.insert({
            f1: i,
            f2: `COMMENT FOR ${i}`
        })
    }
}