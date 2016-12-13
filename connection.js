/* @flow */
'use strict'

import IPFS from 'ipfs-daemon/src/ipfs-browser-daemon'
import Orbit from 'orbit_'

const settings = {
  IpfsDataDir: '/orbit/ipfs',
  Addresses: {
    API: '/ip4/127.0.0.1/tcp/0',
    Swarm: [
      // '/ip4/127.0.0.1/tcp/32333/ws',
      '/ip4/0.0.0.0/tcp/0'
    ],
    Gateway: '/ip4/0.0.0.0/tcp/0'
  },
  // Use local webrtc-star server: https://github.com/libp2p/js-libp2p-webrtc-star
  // SignalServer: '0.0.0.0:9090',
  SignalServer: '178.62.241.75',
  API: {
    HTTPHeaders: {
      "Access-Control-Allow-Origin": ['*'],
      "Access-Control-Allow-Methods": ["PUT", "GET", "POST"],
      "Access-Control-Allow-Credentials": ["true"]
    }
  }
}

const orbitSettings = {
  // path where to keep generates keys
  keystorePath: '/orbit/data/keys',
  // path to orbit-db cache file
  cachePath: '/orbit/data/orbit-db',
  // how many messages to retrieve from history on joining a channel
  maxHistory: 64
}

export default function setup (onMessage) {
  const ipfs = new IPFS(settings)
  ipfs.on('ready', () => {
    console.log('ready')
    const orbit = new Orbit(ipfs, orbitSettings)

    orbit.events.on('connected', (network, user) => {
      console.log('connected', network, user)
      join(orbit, onMessage)
    })

    orbit.events.on('disconnected', () => {
      console.log('disconnected')
    })
  })

  ipfs.on('error', (e) => console.error(e))
}

function join (orbit) {
  orbit.join('ipfs').then((name) => {
    console.log('joined %s', name)
    const feed = orbit.channels[name].feed

    feed.events.on('history', (name, messages) => {
      console.log('got history', name, messages)
      messages.forEach((m) => {
        onMessage(m)
      })
    })
  })

  orbit.events.on('message', (channel, message) => {
    console.log('message', channel, [message])
    onMessage(message)
  })
}
