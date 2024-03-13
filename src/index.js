import 'babel-polyfill'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import "./common/js/Prototype"
import './common/style/common.less';

import VSelect from '@/common/components/select/virtual/index'
import Select from '@/common/components/select/index'

//let store = configureStore;//createStore(reducer)
class Root extends Component {
  state = {
    value:'',
    value1:''
  }
  componentDidMount () {

  }
  render() {
    return <div style={{display:'flex',padding:'20px'}}>
      <div style={{width:'500px'}}>
        <div>使用react-window实现的下拉框加载100000</div>
        <VSelect
          allowClear
          showSearch
          placeholder="支持大数据的Select"
          labelField='name'
          dataProvider={Array.from({ length: 100000 }).map((v, i) => ({ key:`${i}`,id: `${i}`, name: 'test' + i }))}
          valueField='id'
          style={{ width: 120 }}
          defaultValue={this.state.value}
          value={this.state.value}
          filterOption={(input, option) => option.name.indexOf(input) >= 0}
          onChange={(value) => (this.setState({ value }))}
        />
      </div>
      <div>
        <div>使用antd下拉框加载10000</div>
        <Select
          allowClear
          showSearch
          labelField='name'
          dataProvider={Array.from({ length: 10000 }).map((v, i) => ({ key:`${i}`,id: `${i}`, name: 'test' + i }))}
          valueField='id'
          style={{ width: 120 }}
          value={this.state.value1}
          defaultValue={this.state.value1}
          filterOption={(input, option) => option.name.indexOf(input) >= 0}
          onChange={(value1) => (this.setState({ value1 }))}
        />
      </div>
    </div>
  }
}
ReactDOM.render(<Root/>,
  document.getElementById('root')
);
registerServiceWorker();
