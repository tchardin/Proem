/**
 * Text modules for consistent text throughout the app
 * @flow
 */

'use strict'

import React from 'react'
import ReactNative, {StyleSheet, Dimensions} from 'react-native'
import {
  activeText,
  invertedText
} from './PColors'

export function Text({style, ...props}: Object): ReactElement {
  return <ReactNative.Text style={[styles.text, style]} {...props} />
}

export function Heading1({style, ...props}: Object): ReactElement {
  return <ReactNative.Text style={[styles.h1, style]} {...props} />
}

export function TickerText({style, ...props}: Object): ReactElement {
  return <ReactNative.Text style={[styles.tick, style]} {...props} />
}

const scale = Dimensions.get('window').width / 375

function normalize(size: number): number {
  return Math.round(scale * size)
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'BungeeHairline-regular',
  },
  h1: {
    fontFamily: 'Bungee-Regular',
    fontSize: normalize(24),
    // lineHeight: normalize(27),
    color: activeText,
  },
  tick: {
    fontFamily: 'Hydrophilia_Iced',
    fontSize: normalize(15),
    // lineHeight: normalize(23),
    color: invertedText,
  },
})
