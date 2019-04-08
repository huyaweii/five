import React, { Component } from 'react';
import './App.css';
var qiniu = require('qiniu-js')

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      list: [],
      isManage: false,
      title: '',
      price: '',
      desc: '',
      image: ''
    }
  }
  componentDidMount() {
    const _this = this
    fetch('https://cmty.xyz/fives/list')
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        _this.setState({list: data.fiveList, isManage: Boolean(window.location.search)})
      })
  }
  onChange(name, e) {
    this.setState({[name]: e.target.value})
  }
  upload(e) {
    const _this = this
    const files = e.target.files
    fetch('https://cmty.xyz/uploadToken')
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        const token = data.uploadToken
        const file = Array.prototype.slice.call(files)
        const observable = qiniu.upload(file[0], file[0].name, token)
        observable.subscribe((res) =>{_this.setState({image: `http://www.qiniu.cmty.xyz/${file[0].name}`})})
      })
    // qiniu.upload()
  }
  submit() {
    const _this = this
    const {title, price, desc, image} = this.state
    fetch('https://cmty.xyz/fives/create', {
      method: 'post',
      body: JSON.stringify({title, price, desc, image}),
      mode: 'cors',
      headers: {
        'content-type': 'application/j~son'
      }
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        window.location.href = window.location.origin
      })
  }
  render() {
    const {isManage} = this.state
    if (isManage) {
      return <div className='create'>
        <div className='inputWrap'>标题：<input onChange={this.onChange.bind(this, 'title')}/></div>
        <div className='inputWrap'>描述：<input onChange={this.onChange.bind(this, 'desc')}/></div>
        <div className='inputWrap'>价格：<input onChange={this.onChange.bind(this, 'price')}/></div>
        <input type='file' name='file' onChange={this.upload.bind(this)} />
        <button className='sub' onClick={this.submit.bind(this)}>提交</button>
      </div>
    }
    return (
      <div className="App">
        {
          this.state.list.map(item => <div className='item' key={item.id}>
            <img className='image' alt='' id='img' src={item.image} />
            <div className='info'>
              <div className='titleWrap'>
                <div className='title'><b>{item.title}</b></div>
                <div>{item.desc}</div>
              </div>
              <span className='price'>{item.price}元</span>
            </div>
          </div>)
        }
      </div>
    );
  }
}

export default App;
