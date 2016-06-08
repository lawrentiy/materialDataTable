import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';
import * as Styles from 'material-ui/styles';
import {composeWithTracker} from 'react-komposer';
import { Mongo } from 'meteor/mongo';

// Import package with DataTable
import DataTable from 'meteor/lawrentiy:material-ui-table';

Coll = new Mongo.Collection('collection'); //Initialize collection

const schemaObject = { // Define scheme of data
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

Coll.attachSchema(new SimpleSchema(schemaObject)); // Attach schema to collection

// Create react class for application with DataTable and material-ui
class App extends React.Component {
    render() {
        return (
            <Styles.MuiThemeProvider muiTheme={Styles.getMuiTheme(Styles.lightBaseTheme)}>
                <DataTable
                    publication="collection"
                    collection={Coll}
                    settings ={{
                    Table: {
                        fixedHeader: true,
                        fixedFooter: true,
                        selectable: false,
                        height: 'calc(100vh - 75px)'
                    },
                    TableHeader: {
                        displaySelectAll: false,
                        adjustForCheckbox: false
                    },
                    TableBody: {
                        selectable: false,
                        displayRowCheckbox: false,
                        showRowHover: true
                    }
                }}
                    />
            </Styles.MuiThemeProvider>
        )
    }
}

if (Meteor.isClient) { // Render App into Dom
    Meteor.startup(function() {
        render(<App />, document.getElementById('react-holder'));
    });
}

if (Meteor.isServer) {

    if (Coll.find().count() == 0) { // Create 1000 documents
        for (var i = 0; i < 1000; i++) {
            Coll.insert({
                f1: i,
                f2: `COMMENT FOR ${i}`
            })
        }
    }

    Meteor.publish('collection', function({paging, sort}) { // publish collection with parameters paging and sort
        const filter = {};
        const params = {};
        if (_.isObject(paging)) {
            params.limit = paging.pageSize || 20;
            params.skip = params.limit*((paging.currentPage || 1) - 1) || 0;
        }
        if (sort) params.sort = sort;
        return Coll.find(filter, params);
    });
}