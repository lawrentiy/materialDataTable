import { Meteor } from 'meteor/meteor';
import Coll from '../collection.js';

Meteor.publish('collection', function({pagging, sort}) {
    const filter = {};
    const params = {};
    if (_.isObject(pagging)) {
        params.limit = pagging.pageSize || 20;
        params.skip = params.limit*((pagging.currentPage || 1) - 1) || 0;
    }
    if (sort) params.sort = sort;
    return Coll.find(filter, params);
});