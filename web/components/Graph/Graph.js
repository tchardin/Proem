/**
 * Dynamic graph component with multiple areas, lines vectors.
 */
import React, {Component} from 'react'
import {
  VictoryArea,
  VictoryChart,
  VictoryStack,
  VictoryTooltip,
  VictoryZoomContainer
} from 'victory'
// import axios from 'axios'
import s from './styles.css'

class GraphComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      height: 300
    }
    this.selectArea = this.selectArea.bind(this)
  }

  selectArea(e) {
    this.props.onSelectArea(e)
  }

  componentDidMount() {
    // var self = this;
    // axios.get("http://127.0.0.1:5000/" + this.props.header).then((response) => {
    //     self.setState({
    //       // parseFloat(a.Mid)
    //       data: response.data.map((a, index) => {return ({time: index, price: parseFloat(a.Mid)})})
    //     })
    //   }).catch((error) => {
    //     console.log('error: ' + error)
    //   });
  }

  render() {
    let children
    children = this.props.data.map(area => (
      <VictoryArea
        data={area.chart}
        x="time"
        y="price"
        events={[{
          target: "parent",
          eventHandlers: {
            onClick: () => this.selectArea(area)
          }
        }]}
        labels={(datum) => datum.y}
        labelComponent={<VictoryTooltip/>}
        containerComponent={<VictoryZoomContainer/>}
        interpolation={"natural"}
        style={{
          data: {cursor: 'pointer'}
        }}
        padding={0}
        key={area.id}
      />
    ))
    return (
      <div className={s.container}>
        <VictoryStack
          domain={{x: [0, 8], y: [0, 7000]}}
          colorScale={["#000000", "#202020", "#404040", "#606060", "#808080", "#A0A0A0", "#B8B8B8", "#D0D0D0"]}
          style={{
            parent: {lineHeight: 0}
          }}
          padding={0}>
          {children}
        </VictoryStack>
      </div>
    )
  }
}

export default GraphComponent
