/***************************************************
 * 时间: 2024-2-2
 * 作者: flj
 * 说明: 基于antd Select下拉菜单封装
 * 使用方法：
 *<Select placeholder="..." allowClear={true} dataProvider={[]} style={{...}}  className="..."
 * labelField="下拉框选项显示文字" valueField="下拉框选项显示value"
 *  onSelect={...}/>
 *
 ***************************************************/
import React, { Component } from 'react'
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Select from 'antd/lib/select';
import './index.less'

const hiddenStyle = { overflow: 'hidden' };
class Index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataProvider:[]
    }
    this.rowRenderer = this.rowRenderer.bind(this);
  }

  componentDidMount(){
    this.setDataProvider(this.props.dataProvider);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.dataProvider && JSON.stringify(nextProps.dataProvider) != JSON.stringify(this.props.dataProvider)){
      this.setDataProvider(nextProps.dataProvider);
    }
  }

  setDataProvider = (propsDataProvider=[]) =>{
    this.orinianlData = JSON.parse(JSON.stringify( propsDataProvider));
    this.setState({dataProvider:propsDataProvider});
  }

  handleEventPrevent = (e) => {
    e.preventDefault();
  };

  // 清空的时候触发 v为 undefined
  handleChange = (v) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(Array.isArray(v) ? v.map(vv => vv.key) : v.key);
    }
    this.setState({
      value: v,
      searchValue: '',
      open:!this.state.open
    });
  };

  handleDropdownVisibleChange = (open) => {
    const { onDropdownVisibleChange } = this.props;
    this.setState({ open });
    if (onDropdownVisibleChange) {
      onDropdownVisibleChange(open);
    }
  };

  findTableAndFields = (findStr) =>{
    let showArr = [];
    if(this.orinianlData && this.orinianlData.length > 0){
      let arr = this.orinianlData;
      for(let i=0;i<arr.length;i++){
        let item = arr[i];
        let currentItem;
        if(this.props.labelField){
          currentItem = item[this.props.labelField];
        }else{
          currentItem = item;
        }
        if(currentItem.toLowerCase().indexOf(findStr.toLowerCase()) > -1){
          showArr.push(item);
        }
      }
    }
    return showArr;
  }

  handleSearch = (searchValue) => {
    this.setState({
      searchValue,
    });
    let arr = this.findTableAndFields(searchValue);
    this.setState({dataProvider:arr});
  };



  filterOption = (input, option, defaultFilter ) => {
    const { filterOption } = this.props;
    let filterFn = filterOption;
    if ('filterOption' in this.props) {
      if (filterOption === true) {
        filterFn = defaultFilter.bind(this);
      }
    } else {
      filterFn = defaultFilter.bind(this);
    }

    if (!filterFn) {
      return true;
    }
    if (typeof filterFn === 'function') {
      return filterFn.call(this, input, option);
    }
    if (option.disabled) {
      return false;
    }
    return true;
  };

  rowRenderer ({ index, style }) {
    const { valueField, labelField} = this.props;
    const {dataProvider} = this.state;
    const option = dataProvider[index];
    const events = option.disabled
      ? {}
      : {
        onClick: () => this.handleChange(option),
      };
    return (
      <div className={''} style={style} {...events}>
        {option[labelField]}
      </div>
    );
  };

  renderMenu = (menu) => {
    const {
      prefixCls
    } = this.props;
    const { dataProvider=[]} = this.state;
    //const options = dataProvider;
    if (dataProvider.length === 0) {
      return menu;
    }
    return (
      <div onMouseDown={this.handleEventPrevent} style={{height:'320px'}}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={(element=>{this.avList=element})}
              height={height}
              itemCount={dataProvider.length}
              itemSize={35}
              width={width}
              itemData={dataProvider.length}
            >
              {this.rowRenderer}
            </List>
          )}
        </AutoSizer>
      </div>
    );
  };

  render() {
    const {open} = this.state;
    const {className,style, onClick,...other} = this.props;
    return (
      <div className={className} style={{display:'inline-block',...style}} onClick={onClick} id="select">
        <Select
          {...other}
          open={open}
          onSearch={this.handleSearch}
          style={style}
          optionFilterProp="children"
          dropdownRender={menu => this.renderMenu(menu)}
          onDropdownVisibleChange={this.handleDropdownVisibleChange}
          dropdownStyle={hiddenStyle}
        >
        </Select>
      </div>
    );
  }
}

Index.propTypes = {
  labelField: PropTypes.string,
  valueField:PropTypes.string,
  className:PropTypes.string,
  dataProvider:PropTypes.array
};

export default Index
