/***************************************************
 * 时间: 2018-6-8
 * 作者: flj
 * 说明: antd Select下拉菜单封装
 * 使用方法：
 *<Select placeholder="..." allowClear={true} dataProvider={[]} style={{...}}  className="..."
 * labelField="下拉框选项显示文字" valueField="下拉框选项显示value"
 *  onSelect={...}/>
 *
 ***************************************************/
import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Select from 'antd/lib/select';
import {Popover} from 'antd';
import './index.less'

const Option = Select.Option;
const maxNum = 100000;

class Index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible:false,
      dataProvider:[]
    }
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
    let dataProvider = [];
    if(propsDataProvider.length > maxNum){
      this.orinianlData = JSON.parse(JSON.stringify( propsDataProvider));
      dataProvider = propsDataProvider.slice(0,maxNum);
    }else{
      dataProvider = propsDataProvider.slice(0);
    }
    this.setState({dataProvider:dataProvider});
  }

  filterOption = (input, option) => {
    return option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }

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
          /*if(showArr.length >= 100){
            break;
          }*/
        }
      }
    }
    return showArr;
  }

  onSearch = (val)=> {
    console.log('search:', val);
    if(this.orinianlData && this.orinianlData.length > maxNum){
      let arr = this.findTableAndFields(val);
      this.setState({dataProvider:arr});
    }
  }

  render() {
    const {dataProvider} = this.state;
    const {labelField,valueField,className,style, onClick,...other} = this.props;
    return (
      <div className={className} style={{display:'inline-block',...style}} onClick={onClick||this.testClick} id="select">
        <Select
          {...other}
          onSearch={this.onSearch}
          style={style}
          optionFilterProp="children"
          filterOption={this.filterOption}>
          {dataProvider && dataProvider.map((item, index) => {
            let label = "";
            let value = "";
            if(labelField && valueField){
              label = item[labelField];
              value = item[valueField];
            }

            if (labelField && valueField) {
              let isShowPopover = label && label.length > 20;
              let show = <Popover  ref={(ele)=>this[value+"-popover"] = ele} key={value+"-popover"} id={label+"-popover"} content={label} placement="right" align={{ offset: [30, 0] }}>
                <span className="label-show" style={{display:'inline-block',width:"100%"}} >{label}</span>
              </Popover>;
              if(!isShowPopover){
                show = <span className="label-show" style={{display:'inline-block',width:"100%"}} >{label}</span>
              }

              return <Option key={label+value} value={value} style={{width:'100%'}}>
                {show}
              </Option>
            } else {
              let isShowPopover = item && item.length > 20;
              let show = <Popover ref={(ele)=>this[value+"-popover"] = ele}  key={item+"-popover"} id={item+"-popover"} content={item} placement="right" align={{ offset: [30, 0] }}>
                <span className="label-show" style={{display:'inline-block',width:"100%"}} >{item}</span>
              </Popover>;
              if(!isShowPopover){
                show = <span className="label-show" style={{display:'inline-block',width:"100%"}} >{item}</span>;
              }
              return <Option key={item+"-Option"} value={item} style={{width:'100%'}}>
                {show}
              </Option>
            }
          })}
        </Select>
      </div>
    );
  }
}

/*
Index.defaultProps = {
  dataProvider: []
};
*/

Index.propTypes = {
  labelField: PropTypes.string,
  valueField:PropTypes.string,
  className:PropTypes.string,
  dataProvider:PropTypes.array
};

export default Index
