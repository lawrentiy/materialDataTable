import React from 'react';
import * as UI from 'material-ui'
import * as SvgIcon from 'material-ui/svg-icons';
import * as Styles from 'material-ui/styles';
import {composeWithTracker} from 'react-komposer';

const { EditorModeEdit, ActionDelete } = SvgIcon;

const style = {
    actions: {width: 70}
};

class Table extends React.Component {

    constructor(props) {
        super(props);
        let {actions={}, columns } = props;
        this.state = {
            columns,
            showActions: Object.keys(actions).length > 0 // If any action in actions field was received
        };
        this.onRowSelection = this.onRowSelection.bind(this);
    }

    onRowSelection(selection) {
        const [first] = selection;
        const firstObject = this.props.data[first];
    }

    onEditClick(record) {
        if (this.props.onEditClick)
            this.props.onEditClick(record);
    }

    onDeleteClick(record) {
        if (this.props.onDeleteClick)
            this.props.onDeleteClick(record);
    }

    onRowHover(rowId) {
        this.setState({hoveredRecord: this.props.data[rowId]})
    }

    onRowHoverExit() {
        this.setState({hoveredRecord: undefined})
    }

    getActions(record) {
        if (!record || !this.state.hoveredRecord || record._id != this.state.hoveredRecord._id
            ) return;
        const {actions} = this.props;
        return (<div>{Object.keys(actions).map((i) => {
                if (i == 'edit' && actions[i] === true) {
                    return (
                        <UI.IconButton onClick={this.onEditClick.bind(this, record)} >
                            <EditorModeEdit color={Styles.colors.grey400} />
                        </UI.IconButton>
                    )
                }
                else if (i == 'remove' && actions[i] === true) {
                    return (
                        <UI.IconButton onClick={this.onDeleteClick.bind(this, record)} >
                            <ActionDelete color={Styles.colors.grey400} />
                        </UI.IconButton>
                    );
                }
                else {
                    const act = actions[i];
                    return (<UI.IconButton key={act.key} onClick={act.onClick.bind(this, record)}>
                        {act.icon}
                    </UI.IconButton>)
                }
            })}</div>);
    }

    render() {
        let {data, settings} = this.props;
        let {columns, showActions} = this.state;
        const {Table={}, TableHeader={}, TableBody={}, TableFooter={}} = settings || {};

        Table.onRowSelection = this.onRowSelection;

        if (showActions) style.actions.width = Object.keys(this.props.actions).length*40;

        return (
            <UI.Table onRowHover={this.onRowHover.bind(this)} onRowHoverExit={this.onRowHoverExit.bind(this)} {...Table}>
                { TableHeader === false ? null :
                    < UI.TableHeader {...TableHeader}>
                        <UI.TableRow>
                        {columns.map((column) => (
                            <UI.TableHeaderColumn key={column.field}>{column.title || column.field}</UI.TableHeaderColumn>
                        ))}
                        {showActions ? <UI.TableHeaderColumn style={style.actions}/> : null }
                        </UI.TableRow>
                    </UI.TableHeader>
                }
                <UI.TableBody {...TableBody}>
                    {data.map((record) => (
                        <UI.TableRow key={record._id}>
                            {columns.map(f => <UI.TableRowColumn key={f.field}>{f.render(f, record)}</UI.TableRowColumn>)}
                            {showActions ?
                                <UI.TableRowColumn style={style.actions}>
                                    {this.getActions.call(this, record)}
                                </UI.TableRowColumn>
                                 : null }
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
    columns: React.PropTypes.array.isRequired,
    onEditClick: React.PropTypes.func
};

Table.defaultProps = {
    data: []
};

export default Table;
