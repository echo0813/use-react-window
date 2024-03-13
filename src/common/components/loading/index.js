/***************************************************
 * 时间: 2017-7-26
 * 作者: flj
 * 说明: Loading 加载效果
 * 使用方式:
 * import loading from './loading'
 * loading.show(true)   //显示loading效果
 * loading.show(false)  //隐藏loading效果
 *
 ***************************************************/
import React from 'react'
import ReactDOM from 'react-dom'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import './loading.less'

class Loading extends React.Component {
  constructor(prop) {
    super(prop)
    this.state = {}
  }

  render() {
    const { show,waitingDesc } = this.state;
    return (
      show? <ReactCSSTransitionGroup transitionName="in" transitionEnterTimeout={200} transitionLeaveTimeout={150}>
        <div className="loading">
          <div className="loading-desc">{waitingDesc?waitingDesc:''}</div>
        </div>
      </ReactCSSTransitionGroup>:null
    )
  }
}

let instance;

/**
 * 把Loading 效果 添加的 body 上, 显示 loading
 * 这样只需要使用 函数的形式就可以调用 loading 效果
 * @param show
 */
function showLoading(show,waitingDesc='') {
  if (!instance) {
    let container;
    if(!document.getElementById("fn-loading")){
      container = document.createElement('div');
      container.id = "fn-loading";
      document.body.appendChild(container)
    }else {
      container = document.getElementById("fn-loading");
    }
    instance = ReactDOM.render(<Loading/>, container)
  }
  instance && instance.setState({
    show: show,
    waitingDesc:waitingDesc
  })
}

export default {
  show: showLoading
}