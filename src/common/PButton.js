/**
 * Flat button and inverted flat button with heavy drop shadow
 * @flow
 */

import React from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import {activeText, invertedText} from './PColors'
import {Heading1, Text} from './PText'

class PButton extends React.Component {
  props: {
    type: 'primary' | 'inverted' | 'borderless';
    caption: string;
    style?: any;
    onPress: () => mixed;
  }

  static defaultProps = {
    type: 'primary',
  }
  render() {
    const caption = this.props.caption.toUpperCase()
    let content
    if (this.props.type === 'primary') {
      content = (
        <View
          style={[styles.button, styles.primaryButton, styles.border, styles.shadow]}>
          <Heading1 style={[styles.caption, styles.primaryCaption]}>
            {caption}
          </Heading1>
        </View>
      )
    }
    return (
      <TouchableOpacity
        accessibilityTraits="button"
        onPress={this.props.onPress}
        activeOpacity={0.4}
        style={[styles.container, this.props.style]}>
        {content}
      </TouchableOpacity>
    )
  }
}

export default PButton

const HEIGHT = 54
const WIDTH = 260

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    width: WIDTH
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  border: {
    borderWidth: 1,
    borderColor: activeText,
    borderRadius: HEIGHT/5
  },
  shadow: {
    shadowColor: activeText,
    shadowOffset: {width: -5, height: 5},
    shadowOpacity: 1,
    shadowRadius: 0
  },
  primaryButton: {
    backgroundColor: invertedText
  },
  caption: {
    fontSize: 16
  },
  primaryCaption: {
    color: activeText
  }
})
