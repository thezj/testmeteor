import {
  Meteor
} from 'meteor/meteor'
import React from "react"
import {
  render
} from 'react-dom'
import '../imports/startup/accounts-config'
import App from '../imports/ui/App'

Meteor.startup(_ => {
  render( < App / > , document.querySelector('#render-target'))
})