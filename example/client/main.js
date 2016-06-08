import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';
import * as Styles from 'material-ui/styles';
import {composeWithTracker} from 'react-komposer';

import Coll from '../collection.js';
import TabledData from './material-ui-table/material-ui-table.js';

const defaultTheme = Styles.lightBaseTheme;

class App extends React.Component {
    render() {
        //const columns = [
        //    {field: 'f1', title: '111111'},
        //    {field: 'f2', title: '222211'}
        //];

        return (
            <Styles.MuiThemeProvider muiTheme={Styles.getMuiTheme(defaultTheme)}>
                <TabledData
                publication="collection"
                collection={Coll}
                //columns={columns}
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

Meteor.startup(function() {
    render(<App />, document.getElementById('react-holder'));
});