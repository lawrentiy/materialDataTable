import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';
import * as Styles from 'material-ui/styles';
import * as UI from 'material-ui';
import {composeWithTracker} from 'react-komposer';
import { Mongo } from 'meteor/mongo';
import ReactAutoForm from './autoform.js';

// TODO: remove it from that calls and put inside package
import { Match } from 'meteor/check'
SimpleSchema.extendOptions({
    MMR: Match.Optional(Object)
});

// Import package with DataTable
import DataTable, {generateColumnsList} from 'meteor/lawrentiy:material-data-table'

Coll = new Mongo.Collection('collection'); //Initialize collection

const schemaObject = { // Define scheme of data
    f1: {
        optional: false,
        type: String,
        max: 100,
        MMR: {table: true}
    },
    f2: {
        optional: false,
        type: String,
        max: 100,
        MMR: {table: true}
    }
};

Coll.attachSchema(new SimpleSchema(schemaObject)); // Attach schema to collection

// Create react class for application with DataTable and material-ui
class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // get colums from SimpleSchema. second parameter - for titles generating
            columns: generateColumnsList(Coll, (title) => title),
            open: false
        }
    }

    render() {
        return (
            <Styles.MuiThemeProvider muiTheme={Styles.getMuiTheme(Styles.lightBaseTheme)}>
                <div>
                    <DataTable
                        publication="collection"
                        collection={Coll}
                        columns = {this.state.columns}
                        onEditClick ={(record) => {
                                this.setState({open: true, doc: record, mode: "update"});
                            }}
                        settings ={{
                            Table: {
                                fixedHeader: true,
                                fixedFooter: true,
                                selectable: false
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

                    <UI.Dialog
                        title="Edit record"
                        //actions={actions}
                        modal={false}
                        open={this.state.open}
                        //onRequestClose={this.handleClose}
                        autoScrollBodyContent={true}
                        >
                        <ReactAutoForm collection={Coll} type="update"
                                       doc = {this.state.doc}
                                       debug = {true}
                                       onSubmit={() => {
                                                console.log(this);
                                                this.setState({open: false, doc: undefined})
                                            }}/>
                    </UI.Dialog>
                </div>
            </Styles.MuiThemeProvider>
        )
    }
}

if (Meteor.isClient) { // Render App into Dom
    Meteor.startup(function() {
        console.log('!!!!!!!!!!');
        render(<App />, document.getElementById('react-holder'));
    });
}

// Server methods and fixtures
if (Meteor.isServer) {

    if (Coll.find().count() == 0) { // Create 1000 documents
        for (var i = 0; i < 1000; i++) {
            Coll.insert({
                f1: i,
                f2: `COMMENT FOR ${i}`
            })
        }
    }

    Coll.allow({
        insert: function() {
            return true;
        },
        update: function() {
            return true;
        }
    });

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