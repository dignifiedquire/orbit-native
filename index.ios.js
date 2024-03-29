/* @flow */
'use strict'

import './shim.js'
import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate
} from 'react-native-webrtc'

window.RTCPeerConnection = RTCPeerConnection
window.RTCSessionDescription = RTCSessionDescription
window.RTCIceCandidate = RTCIceCandidate

import connect from './connection.js'

export default class Orbit extends Component {
  constructor (props) {
    super(props)
    this.state = {messages: []}
    this.onSend = this.onSend.bind(this)
    connect()
  }

  componentWillMount () {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        },
      ],
    })
  }

  onSend (messages = []) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      }
    })
  }
  render () {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        user={{
          _id: 1
        }}
      />
    )
  }
}

AppRegistry.registerComponent('orbit', () => Orbit)
