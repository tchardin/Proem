import React, {Component} from 'react'
import Svg from 'react-native-svg'
import {VictoryAxis, VictoryBar, VictoryChart, VictoryLine, VictoryZoomContainer} from 'victory-native'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'

const data = [
  {time: 0, price: 2842},
  {time: 1, price: 2480},
  {time: 2, price: 3238},
  {time: 3, price: 3892},
  {time: 4, price: 1209}
]

export default class Graph extends Component {
  render() {
    return (
      <View style={styles.container}>
        <VictoryChart
          domainPadding={40}
          containerComponent={
            <VictoryZoomContainer />
          }>
          <VictoryAxis
            tickValues={[1, 2, 3, 4]}
            tickFormat={['May', 'June', 'July', 'August']}
            style={{
              axis: {stroke: 'white'},
              ticks: {stroke: 'white'},
              tickLabels: {fill: 'white', padding: 25}
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(x) => (`$${x/1000}k`)}
            style={{
              axis: {stroke: 'white'},
              ticks: {stroke: 'white'},
              tickLabels: {fill: 'white'}
            }}
          />
          <VictoryLine
            interpolation={"natural"}
            data={data}
            style={{data: {stroke: 'white'}}}
            x="time"
            y="price"
          />
        </VictoryChart>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})
