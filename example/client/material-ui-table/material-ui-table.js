import React from 'react';
import * as UI from 'material-ui'
import * as SvgIcon from 'material-ui/svg-icons';
import * as Styles from 'material-ui/styles';
import {composeWithTracker} from 'react-komposer';
import Pagination from './paggination.jsx'

const {EditorModeEdit} = SvgIcon;

const style = {
    actions: {width: 50}
};

/* ================== TABLE ======================== */
class Table extends React.Component {

    constructor(props) {
        super(props)
        this.onRowSelection = this.onRowSelection.bind(this);
    }

    onRowSelection(selection) {
        const [first] = selection;
        const firstObject = this.props.data[first];
        //console.log(firstObject);
    }

    onEditClick(record) {
        if (this.props.onEditClick)
            this.props.onEditClick(record);
    }

    render() {
        let {data, columns, settings} = this.props;
        const {Table={}, TableHeader={}, TableBody={}, TableFooter={}} = settings || {};

        const schema = this.props.collection._c2._simpleSchema._schema;
        if (schema) {
            columns = [];
            for (var f in schema) {
                columns.push(_.defaults(schema[f], {field: f}));
            }
        }

        Table.onRowSelection = this.onRowSelection;

        return (
            <UI.Table {...Table}>
                <UI.TableHeader {...TableHeader}>
                    <UI.TableRow>
                        {columns.map((column) => (
                            <UI.TableHeaderColumn key={column.field}>{column.title || column.field}</UI.TableHeaderColumn>
                        ))}
                        <UI.TableHeaderColumn style={style.actions} />
                    </UI.TableRow>
                </UI.TableHeader>
                <UI.TableBody {...TableBody}>
                    {data.map((record) => (
                        <UI.TableRow key={record._id}>
                            {columns.map((column) => (
                                <UI.TableRowColumn key={column.field}>{record[column.field]}</UI.TableRowColumn>
                            ))}
                            <UI.TableRowColumn style={style.actions}>
                                <UI.IconButton onClick={this.onEditClick.bind(this, record)} >
                                    <EditorModeEdit color={Styles.colors.grey400} />
                                </UI.IconButton>
                            </UI.TableRowColumn>
                        </UI.TableRow>
                    ))}
                </UI.TableBody>
                <UI.TableFooter {...TableFooter} >
                </UI.TableFooter>
            </UI.Table>
        )
    }
}

Table.propTypes = {
    data: React.PropTypes.array.isRequired,
    columns: React.PropTypes.array,
    publication: React.PropTypes.string,
    publicationObject: React.PropTypes.object,
    onEditClick: React.PropTypes.func
};

Table.defaultProps = {
    data: []
};

function composer(props, onData) {
    if (props.subscription.ready()) {
        const data = props.collection.find({}).fetch();
        onData(null, {
            data
        });
    }
}

const TabledData = composeWithTracker(composer)(Table);




/* ================== TABLEHOLDER ======================== */
function holderComposer(props, onData) {
    //const subs = Meteor.subscribe(props.publication, {
    //    pagging: {
    //        currentPage: props.currentPage || 1,
    //        pageSize: props.pageSize || 10
    //    }
    //});
    //if (subs.ready()) {
    //    const data = props.collection.find({}).fetch();
    //    onData(null, {
    //        data
    //    });
    //}
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
            pagging: {
                currentPage: this.state.currentPage || 1,
                pageSize: this.props.pageSize || 10
            }
        });

        return (<div>
            <Pagination onChange={this.onPageChange} />
            <TabledData {...this.props} subscription={this.sub}/>
        </div>
        )
    }
}


const TableHolder = composeWithTracker(holderComposer)(TableH);

export {
    Table, TabledData, Pagination, TableHolder
}

export default TableHolder