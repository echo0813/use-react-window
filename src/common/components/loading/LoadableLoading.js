/**
 * 页面载入前的loading,用于代码分隔页面SplitLoadable
 * **/

import React from 'react'
import './loading.less'

class LoadableLoading extends React.Component {
  render() {
    return <div className="loading"/>
  }
}

export default LoadableLoading