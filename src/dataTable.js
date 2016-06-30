import React from 'react';
import * as UI from 'material-ui'
import * as SvgIcon from 'material-ui/svg-icons';
import * as Styles from 'material-ui/styles';
import {composeWithTracker} from 'react-komposer';
import Pagination from './pagination.jsx'
import Table from './table.jsx'
import {ReactiveVar} from 'meteor/reactive-var'
import {generateColumnsList} from './columns.js'

const DEFAULT_PAGE_SIZE  = 10;

class TableH extends React.Component {

    render() {
        const {onPageChanged, showPagination, currentPage, ...props} = this.props;

        return (<div>
                <Table {...props} />
                { showPagination ? <Pagination currentPage={currentPage} onChange={onPageChanged}/> : null }
        </div>
        )
    }
}

const curPage = new ReactiveVar(1); // What it will be if there is not one table at page?

function composer(props, onData) {
    const currentPage = curPage.get();
    const {filter, publication, collection, pageSize = DEFAULT_PAGE_SIZE} = props;

    if (publication) {
        const p = {
            filter: filter,
            paging: { pageSize, currentPage}
        };
        const sub = Meteor.subscribe(publication, p);

        if (sub.ready()) {
            const data = collection.find({}).fetch();

            // Current page is fewer than pageSize, that means that page is the end page. if maxpage=0, than hide pagination
            const showPagination = currentPage == 1 && data.length >= (pageSize) || currentPage > 1;

            onData(null, { showPagination, data,
                currentPage: curPage.get(),
                onPageChanged: v => curPage.set(v)
            });
        }
    }
    else {
        const data = collection.find({}).fetch();
        onData(null, {data});
    }
}

const MyLoading = () => (<UI.CircularProgress style={{position: 'relative', top: '50vh', left: '50vw'}}/>);
const DataTable = composeWithTracker(composer, MyLoading)(TableH);

export {
    Table, Pagination, DataTable,
    generateColumnsList
}

export default DataTable