// Testing the sliderbar! 

import React, { Component } from 'react'
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'; 



export default class SliderTest extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      volume: 5
    }
    this.handleOnChange = this.handleOnChange.bind(this); 
  }
 
  handleOnChange (value){
    this.setState({
      volume: value
    })
  }
 
  render() {
    let { volume } = this.state
    return (
      <div style={{width:window.innerWidth/2,paddingLeft:20,paddingTop:200}}>
      <Slider
        value={volume}
        onChange={this.handleOnChange}
        min={0}
        max={10} 
        labels={{ 0: 'Low', 10: 'High'}}
      />
      </div>
      
    )
  }
}