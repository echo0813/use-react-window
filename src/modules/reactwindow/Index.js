import React, {Component} from 'react'
import {Icon,Input,Button} from 'antd';
//import {ReactWindowTransfer} from 'daasbi_common'
import ReactWindowTransfer from '@/common/components/reactwindowtransfer'
import '../../common/style/common.less'
const DEFAULT_LEN = 10000;//数据条数  76万

class Index extends Component {
  constructor(props) {
    super(props);
    let ulData = Array.from({ length: 100 }).map((v, i) => ({ key:`${i}`,id: `${i}`, name: 'test' + i }))
    this.state = {
      selectedKeys: [],
      targetKeys: [], // 精确筛选选中的内容
      dataLen:DEFAULT_LEN,
      data:[],
      ulData
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

  filterOption = (inputValue, option)=> {
    return option.title.indexOf(inputValue) > -1;
  }

  // 穿梭框更改
  handleChange = (targetKeys) => {
    this.setState({ targetKeys });
  }

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys)=> {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
  }

  render() {
    const{data=[],targetKeys=[],selectedKeys=[],dataLen,ulData} = this.state;
    return (
      <div style={{width:'800px',height:'100%',padding:'16px'}}>
        <div>使用react-widow自定义的穿梭框</div>
        <div style={{display:'flex',marginBottom:'16px'}}>
          <Input value={dataLen} onChange={this.onChange} style={{width:'400px',marginRight:'16px'}}/>
          <Button onClick={this.getMockData}>获取数据</Button>
        </div>
        <ReactWindowTransfer
          render={item => `${item.title}`} dataSource={data} targetKeys={targetKeys} selectedKeys={selectedKeys}
          onSelectChange={this.handleSelectChange} filterOption={this.filterOption} onChange={this.handleChange}
          titles={['未选', '已选']} rowHeight={32} listStyle={{width: '40%', height: 360,}} showSearch={true}
          operations={[<Icon type="left" />, <Icon type="right" />]} notFoundContent={'not found'} searchPlaceholder={'Search'}
        />
        <div style={{marginTop:'20px'}}>测试页面最大高度</div>
        <div>页面显示最高高度是 22369600px</div>
        <div style={{width:'300px',height:'400px',overflowY:'scroll',border:'1px solid blue'}}>
          <ul style={{width:'300px',height:'22369700px'}}>
            {ulData.map(item=>{
              return <li key={item.key} style={{marginBottom:'8px',fontSize:'14px'}}>{item.name}</li>
            })}
          </ul>
        </div>

      </div>

    )

  }
}


export default Index;
