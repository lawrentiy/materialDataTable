import React from 'react';
import * as UI from 'material-ui'
import * as SvgIcon from 'material-ui/svg-icons';
import * as Styles from 'material-ui/styles';
import {composeWithTracker} from 'react-komposer';
import Pagination from './pagination.jsx'
import Table from './table.jsx'

function holderComposer(props, onData) {
    onData(null, {});
}

class TableH extends React.Component {

    constructor(props) {
        super(props);
        this.state = {currentPage: 1};
        this.onPageChange = this.onPageChange.bind(this);
    }

    onPageChange(selectedPage) {
        this.setState({currentPage: selectedPage});
    }

    render() {
        if (this.sub) this.sub.stop();
        this.sub = Meteor.subscribe(this.props.publication, {
            paging: {
                currentPage: this.state.currentPage || 1,
                pageSize: this.props.pageSize || 10
            }
        });

        return (<div>
            <Pagination onChange={this.onPageChange} />
            <Table {...this.props} subscription={this.sub}/>
        </div>
        )
    }
}

const DataTable = composeWithTracker(holderComposer)(TableH);

export {
    Table, Pagination, DataTable
}

export default DataTable