import React, {Component} from 'react'
import {Icon,Input,Button,Transfer,Select} from 'antd';
//import {ReactWindowTransfer} from 'daasbi_common'
import '../../common/style/common.less'
const DEFAULT_LEN = 5000;//数据条数
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
      targetKeys: [], // 精确筛选选中的内容
      dataLen:DEFAULT_LEN,
      data:[]
    }
  }

  componentDidMount(){
    this.getMockData();
  }

  getMockData = () =>{
    const{dataLen} = this.state;
    let arr=[];
    for(let i=0;i<dataLen;i++){
      arr.push({key:i,title:`第${i+1}个元素`});
    }
    this.setState({data:arr});
  }

  onChange = (event) =>{
    this.setState({dataLen:event.target.value});
  }

  // 穿梭框更改
  handleChange = (targetKeys) => {
    this.setState({ targetKeys });
  }

  render() {
    const{data=[],targetKeys=[],dataLen} = this.state;
    return (
      <div style={{width:'800px',height:'100%',padding:'16px'}}>
        <div>Antd Design3 的Transfer穿梭框组件</div>
        <div style={{display:'flex',marginBottom:'16px'}}>
          <Input value={dataLen} onChange={this.onChange} style={{width:'400px',marginRight:'16px'}}/>
          <Button onClick={this.getMockData}>获取数据</Button>
        </div>
        <Transfer
          showSearch
          dataSource={data}
          targetKeys={targetKeys}
          onChange={this.handleChange}
          render={item => item.title}
          listStyle={{width: 300,height: 400}}
        />
      </div>

    )

  }
}


export default Index;