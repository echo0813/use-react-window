import React from 'react';
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Checkbox } from 'antd';
import _ from 'lodash';

import Item from './Item';
import Search from './Search';
import prefixCls from './Const';

function noop() { }

function isRenderResultPlainObject(result) {
    return result && !React.isValidElement(result) &&
        Object.prototype.toString.call(result) === '[object Object]';
}

export default class SelectList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            filter: '',
            dataSource: [],
        };

        this.renderItem = this.renderItem.bind(this);
        this.rowRenderer = this.rowRenderer.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleSelectAll = this.handleSelectAll.bind(this);
        this.handleFilterWapper = this.handleFilterWapper.bind(this);
        this.handleFilterWithDebounce = _.debounce(this.handleFilter.bind(this), 200);
        this.handleFilter = this.handleFilter.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.matchFilter = this.matchFilter.bind(this);
    }

    componentWillMount() {
        this.setState({
            dataSource: this.props.dataSource,
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.dataSource !== this.props.dataSource) {
            if (this.state.filter !== '') {
                this.handleFilter(nextProps.dataSource, this.state.filter);
            } else {
                this.setState({
                    dataSource: nextProps.dataSource,
                });
            }
        }
    }

    getCheckStatus() {
        const { selectedKeys } = this.props;
        const { dataSource } = this.state;
        if (selectedKeys.length === 0) {
            return 'none';
        } else if (dataSource.every(item => item.disabled || selectedKeys.indexOf(item.key) >= 0)) {
            return 'all';
        }
        return 'part';
    }

    handleSelect(selectedItem) {
        const { selectedKeys } = this.props;
        const hoder = [...selectedKeys];
        const index = hoder.indexOf(selectedItem.key);
        if (index > -1) {
            hoder.splice(index, 1);
        } else {
            hoder.push(selectedItem.key);
        }
        this.props.handleSelect(hoder);
    }

    handleSelectAll(checkAll) {
        const { dataSource } = this.state;
        const { selectedKeys } = this.props;
        const hoder = [...selectedKeys];
        let index;
        if (!checkAll) {
            dataSource.map((item) => {
                if (!item.disabled && hoder.indexOf(item.key) < 0) {
                    hoder.push(item.key);
                }
                return item;
            });
        } else {
            dataSource.map((item) => {
                index = hoder.indexOf(item.key);
                if (index > -1) {
                    hoder.splice(index, 1);
                }
                return item;
            });
        }
        this.props.handleSelect(hoder);
    }

    handleFilterWapper(e) {
        this.handleFilterWithDebounce(this.props.dataSource, e.target.value);
        this.setState({
            filter: e.target.value,
        });
    }

    matchFilter(filter, item) {
        if (this.props.filterOption) {
            return this.props.filterOption(filter, item);
        }
        const { renderedText } = this.renderItem(item);
        return renderedText.indexOf(filter) >= 0;
    }

    handleFilter(dataSource, filter) {
        const showItems = [];
        dataSource.map((item) => {
            if (!this.matchFilter(filter, item)) {
                return null;
            }
            showItems.push(item);
            return item;
        });
        this.setState({
            dataSource: showItems,
        }, () => {
            /* TODO: maybe we can scroll to the position which user is looking at*/
            //this.list.scrollToRow(0);
        });
    }

    handleClear() {
        this.setState({
            filter: '',
            dataSource: this.props.dataSource,
        });
    }

    rowRenderer({ data,index, style  }) {
        const item = this.state.dataSource[index];
        const { renderedText, renderedEl } = this.renderItem(item);
        const checked = this.props.selectedKeys.indexOf(item.key) >= 0;
        const itemPrefixCls = `${prefixCls}-list`;

        if (this.props.rowKey) {
            item.key = this.props.rowKey(item);
        }

        return (
            <Item
                key={item.key}
                item={item}
                checked={checked}
                style={style}
                renderedText={renderedText}
                renderedEl={renderedEl}
                disabled={item.disabled}
                onClick={this.handleSelect}
                prefixCls={itemPrefixCls}
            />
        );
    }

    renderItem(item) {
        const { render = noop } = this.props;
        const renderResult = render(item);
        const isRenderResultPlain = isRenderResultPlainObject(renderResult);
        return {
            renderedText: isRenderResultPlain ? renderResult.value : renderResult,
            renderedEl: isRenderResultPlain ? renderResult.label : renderResult,
        };
    }

    render() {
        const { footer, showSearch, showHeader, selectedKeys,
                itemUnit, itemsUnit, titleText, style, notFoundContent,
                searchPlaceholder } = this.props;
        const { dataSource } = this.state;

        const className = classNames({
            [`${prefixCls}-list`]: true,
        });

        const footerDom = footer(Object.assign({}, this.props));

        const listFooter = footerDom ? (
            <div className={`${prefixCls}-list-footer`}>
                {footerDom}
            </div>
        ) : null;

        const checkStatus = this.getCheckStatus();
        const checkedAll = checkStatus === 'all';
        const checkAllCheckbox = (
            <Checkbox
                checked={checkedAll}
                indeterminate={checkStatus === 'part'}
                onChange={() => this.handleSelectAll(checkedAll)}
            />
        );
        const unit = dataSource.length > 1 ? itemsUnit : itemUnit;

        // height is not 100%, so there should minus 2px of the boder of transfer-list
        let bodyHeight = style.height - 2;
        bodyHeight = showHeader ? bodyHeight - 33 : bodyHeight;
        bodyHeight = showSearch ? bodyHeight - 38 : bodyHeight;
        bodyHeight = listFooter !== null ? bodyHeight - 32 : bodyHeight;

        const header = showHeader ? (
            <div className={`${prefixCls}-list-header`}>
                {checkAllCheckbox}
                <span className={`${prefixCls}-list-header-selected`}>
                    <span>
                        {(selectedKeys.length > 0 ? `${selectedKeys.length}/` : '') + dataSource.length} {unit}
                    </span>
                    <span className={`${prefixCls}-list-header-title`}>
                        {titleText}
                    </span>
                </span>
            </div>
        ) : null;

        const search = showSearch ? (
            <Search
                value={this.state.filter}
                onChange={this.handleFilterWapper}
                handleClear={this.handleClear}
                prefixCls={`${prefixCls}-list-search`}
                placeholder={searchPlaceholder}
            />
        ) : null;

        return (
            <div className={className} style={style}>
                {header}
                {search}
                <div style={{
                  height: `${bodyHeight}px`
                }}>
                  <AutoSizer>
                    {({ height, width }) => (
                      <List
                        ref={(list) => { this.list = list; }}
                        height={height}
                        itemCount={dataSource.length}
                        itemSize={35}
                        width={width}
                        itemData={selectedKeys} /*不传递itemData，勾选交互不生效*/
                      >
                        {this.rowRenderer}
                      </List>
                    )}
                  </AutoSizer>
                </div>
                {
                    dataSource.length === 0 &&
                    <div
                        className={`${prefixCls}-list-body-not-found`}
                        style={{
                            height: `${bodyHeight}px`,
                            lineHeight: `${bodyHeight}px`,
                        }}
                    >
                        {notFoundContent}
                    </div>
                }
                {listFooter}
            </div>
        );
    }
}


SelectList.defaultProps = {
    filterOption: undefined,
    footer: noop,
    showSearch: false,
    showHeader: true,
    itemUnit: '',
    itemsUnit: '',
    titleText: '',
    style: {
        width: 200,
        height: 300,
    },
    notFoundContent: 'Not Found',
    searchPlaceholder: 'Search here',
    rowKey: undefined,
};

SelectList.propTypes = {
    render: PropTypes.func.isRequired,
    dataSource: PropTypes.array.isRequired,
    selectedKeys: PropTypes.array.isRequired,
    handleSelect: PropTypes.func.isRequired,
    filterOption: PropTypes.func,
    footer: PropTypes.func,
    showSearch: PropTypes.bool,
    showHeader: PropTypes.bool,
    itemUnit: PropTypes.string,
    itemsUnit: PropTypes.string,
    titleText: PropTypes.string,
    rowHeight: PropTypes.number.isRequired,
    style: PropTypes.shape({
        height: PropTypes.number.isRequired, // not support %
        width: PropTypes.any,
    }),
    notFoundContent: PropTypes.string,
    searchPlaceholder: PropTypes.string,
    rowKey: PropTypes.func,
};
