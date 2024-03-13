/**
 * antd3 Transfer大数据量卡、且不支持异步加载数据。为了解决这个问题，自定义Transfer组件 使用react-window虚拟化加载列表，解决大数据量卡顿问题
 *使用方法
 * <Transfer
 render={item => `${item.title}`}
 dataSource={mockData}
 targetKeys={targetKeys}
 selectedKeys={selectedKeys}
 onSelectChange={this.handleSelectChange}
 filterOption={this.filterOption}
 onChange={this.handleChange}
 titles={['未选', '已选']}
 rowHeight={32}
 listStyle={{
                          width: '40%',
                          height: 400,
                        }}
 operations={[<Icon type="left" />, <Icon type="right" />]}
 showSearch
 notFoundContent={'not found'}
 searchPlaceholder={'Search'}
 />
 * **/
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import 'core-js/fn/array/includes';
import SelectList from './SelectList';
import Operation from './Operation';
import prefixCls from './Const';
import './transfer.less';

function noop() { }

export default class Transfer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      leftSource: [],
      rightSrouce: [],
      sourceSelectedKeys: [],
      targetSelectedKeys: [],
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.initStateByProps = this.initStateByProps.bind(this);
    this.moveTo = this.moveTo.bind(this);
    this.moveToLeft = this.moveToLeft.bind(this);
    this.moveToRight = this.moveToRight.bind(this);
  }

  componentWillMount() {
    this.initStateByProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataSource !== this.props.dataSource ||
      nextProps.targetKeys !== this.props.targetKeys ||
      nextProps.selectedKeys !== this.props.selectedKeys) {
      this.initStateByProps(nextProps, true);
    }
  }

  getSelectedKeysName(direction) {
    return direction === 'left' ? 'sourceSelectedKeys' : 'targetSelectedKeys';
  }

  initStateByProps(props, update) {
    const leftSource = [];
    const rightSrouce = new Array(props.targetKeys.length);
    const sourceSelectedKeys = [];
    const targetSelectedKeys = [];
    const oldSourceSelectedKeys = this.state.sourceSelectedKeys;
    const oldTargetSelectedKeys = this.state.targetSelectedKeys;

    props.dataSource.forEach((item) => {
      if (props.rowKey) {
        item.key = props.rowKey(item); // eslint-disable-line
      }

      // rightSource should be ordered by targetKeys
      // leftSource should be ordered by dataSource
      const indexOfKey = props.targetKeys.indexOf(item.key);
      if (indexOfKey !== -1) {
        rightSrouce[indexOfKey] = item;
      } else {
        leftSource.push(item);
      }

      if (!props.selectedKeys && update) {
        // fitler not exist keys
        if (oldSourceSelectedKeys.includes(item.key) &&
          !props.targetKeys.includes(item.key)) {
          sourceSelectedKeys.push(item.key);
        }
        if (oldTargetSelectedKeys.includes(item.key) &&
          props.targetKeys.includes(item.key)) {
          targetSelectedKeys.push(item.key);
        }
      }
    });

    if (props.selectedKeys) {
      props.selectedKeys.forEach((key) => {
        if (props.targetKeys.includes(key)) {
          targetSelectedKeys.push(key);
        } else {
          sourceSelectedKeys.push(key);
        }
      });
    }

    this.setState({
      leftSource,
      rightSrouce,
      sourceSelectedKeys,
      targetSelectedKeys,
    });
  }

  handleSelect(direction, selectedKeys) {
    const leftKeys = direction === 'left' ? selectedKeys : this.state.sourceSelectedKeys;
    const rightKeys = direction === 'right' ? selectedKeys : this.state.targetSelectedKeys;
    const onSelectChange = this.props.onSelectChange;

    if (onSelectChange) {
      onSelectChange(leftKeys, rightKeys);
    }

    if (!this.props.selectedKeys) {
      this.setState({
        sourceSelectedKeys: leftKeys,
        targetSelectedKeys: rightKeys,
      });
    }
  }

  moveTo(direction) {
    const { targetKeys = [], dataSource = [], onChange } = this.props;
    const { sourceSelectedKeys, targetSelectedKeys } = this.state;
    const moveKeys = direction === 'right' ? sourceSelectedKeys : targetSelectedKeys;

    const newMoveKeys = [];
    // disable key can be selected in props, so there should fitler disabled keys
    dataSource.forEach((item) => {
      if (!item.disabled && moveKeys.includes(item.key)) {
        newMoveKeys.push(item.key);
      }
    });
    // move items to target box
    const newTargetKeys = direction === 'right'
      ? newMoveKeys.concat(targetKeys)
      : targetKeys.filter(targetKey => newMoveKeys.indexOf(targetKey) === -1);
    // empty checked keys
    const oppositeDirection = direction === 'right' ? 'left' : 'right';
    this.setState({
      [this.getSelectedKeysName(oppositeDirection)]: [],
    });
    this.handleSelect(oppositeDirection, []);
    if (onChange) {
      onChange(newTargetKeys, direction, newMoveKeys);
    }
  }

  moveToLeft() { this.moveTo('left'); }
  moveToRight() { this.moveTo('right'); }

  render() {
    const { sourceSelectedKeys, targetSelectedKeys } = this.state;
    const { titles, className, filterOption, showSearch, footer, notFoundContent,
      searchPlaceholder } = this.props;
    const leftActive = targetSelectedKeys.length > 0;
    const rightActive = sourceSelectedKeys.length > 0;

    const cls = classNames({
      [`${prefixCls}`]: true,
    }, className);

    return (
      <div className={cls}>
          <SelectList
            dataSource={this.state.leftSource}
            render={this.props.render}
            selectedKeys={this.state.sourceSelectedKeys}
            handleSelect={selectedKeys => this.handleSelect('left', selectedKeys)}
            showSearch={showSearch}
            filterOption={filterOption}
            itemsUnit={'items'}
            itemUnit={'item'}
            titleText={titles[0]}
            rowHeight={this.props.rowHeight}
            style={this.props.listStyle}
            footer={footer}
            notFoundContent={notFoundContent}
            searchPlaceholder={searchPlaceholder}
          />
          <Operation
            className={`${prefixCls}-operation`}
            leftActive={leftActive}
            rightActive={rightActive}
            moveToLeft={this.moveToLeft}
            moveToRight={this.moveToRight}
            leftArrowText={this.props.operations[0]}
            rightArrowText={this.props.operations[1]}
          />
          <SelectList
            dataSource={this.state.rightSrouce}
            render={this.props.render}
            selectedKeys={this.state.targetSelectedKeys}
            handleSelect={selectedKeys => this.handleSelect('right', selectedKeys)}
            showSearch={showSearch}
            filterOption={filterOption}
            itemsUnit={'items'}
            itemUnit={'item'}
            titleText={titles[1]}
            rowHeight={this.props.rowHeight}
            style={this.props.listStyle}
            footer={footer}
            notFoundContent={notFoundContent}
            searchPlaceholder={searchPlaceholder}
          />
      </div>
    );
  }
}

Transfer.defaultProps = {
  dataSource: [],
  selectedKeys: undefined,
  onSelectChange: undefined,
  titles: ['', ''],
  className: undefined,
  filterOption: undefined,
  listStyle: {
    width: 200,
    height: 300,
  },
  operations: ['', ''],
  showSearch: false,
  footer: noop,
  notFoundContent: 'Not Found',
  searchPlaceholder: 'Search here',
  rowKey: undefined,
  onChange: undefined,
};

Transfer.propTypes = {
  dataSource: PropTypes.array,
  render: PropTypes.func.isRequired,
  targetKeys: PropTypes.array.isRequired,
  selectedKeys: PropTypes.array,
  onChange: PropTypes.func,
  onSelectChange: PropTypes.func,
  listStyle: PropTypes.shape({
    height: PropTypes.number.isRequired, // not support %
    width: PropTypes.any,
  }),
  className: PropTypes.string,
  titles: PropTypes.array,
  operations: PropTypes.array,
  showSearch: PropTypes.bool,
  filterOption: PropTypes.func,
  searchPlaceholder: PropTypes.string,
  notFoundContent: PropTypes.string,
  rowHeight: PropTypes.number.isRequired,
  footer: PropTypes.func,
  rowKey: PropTypes.func, // eslint-disable-line
};
