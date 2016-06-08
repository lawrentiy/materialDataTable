import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

Coll = new Mongo.Collection('collection');

const schemaObject = {
    f1: {
        optional: false,
        type: String,
        max: 100
    },
    f2: {
        optional: false,
        type: String,
        max: 100
    }
};

//for (v in BillsSchema) {
//    if (BillsSchema[v].label === void 0) {
//        BillsSchema[v].label = this.Utils.setSchemaTitle('bills', v);
//    }
//}

Coll.attachSchema(new SimpleSchema(schemaObject));

export default Coll;