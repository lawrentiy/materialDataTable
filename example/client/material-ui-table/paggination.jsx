import React from 'react';
import * as UI from 'material-ui'
import * as SvgIcon from 'material-ui/svg-icons';

const {NavigationChevronRight, NavigationChevronLeft } = SvgIcon;

const style={
    button: {
        minWidth: 36,
        fontSize: '85%'
    },
    icon: {
        height: 20,
        width: 20
    }
};

class PaginationButton extends React.Component {

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.props.onClick(this.props.value);
    }

    render() {
        const buttonProps = _.omit(this.props, 'onClick', 'icon', 'style');
        return (
            <UI.FlatButton style={style.button} icon={this.props.icon} onClick={this.onClick} {...buttonProps}>
                {this.props.icon ? undefined : this.props.value}
            </UI.FlatButton>
        )
    }
}

const LastValue = 99999;
const PagesCount = 5;

class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 1,
            pages: [1, 2, 3, 4, 5]
        };
        this.onClick = this.onClick.bind(this);
    }

    onClick(v) {
        let {pages, current} = this.state;
        if (current != v) {
            if (v === LastValue) current = current + PagesCount
                else if (v === 0) current = 1;
                else current = v;
            pages = [];
            const vvv = Math.ceil(PagesCount/2);
            const s1 = current - vvv + 1 > 0 ? current - vvv + 1 : 1;
            let s2 = current + vvv - 1 > 0 ? current + vvv - 1 : 1;
            if (s2 - s1 < PagesCount) s2 = s1 + PagesCount;
            for (var i = s1; i < s2; i++)
                pages.push(i);
            this.setState({current, pages});
            this.props.onChange(current);
        }
    }

    render() {
        const {current, pages} = this.state;
        return (
            <div>
                <PaginationButton value={0} disabled = {current == 1}
                                  icon={<NavigationChevronLeft style={style.icon} />} onClick={this.onClick} />
                { pages.map((b) => (
                    <PaginationButton key={b} value={b} onClick={this.onClick} primary={b === current} />
                ))}
                <PaginationButton value={LastValue} icon={<NavigationChevronRight style={style.icon} />} onClick={this.onClick} />
            </div>
        )
    }
}

Pagination.propTypes = {
    onChange: React.PropTypes.func
};

export default Pagination