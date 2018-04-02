import React, {
    Component
} from 'react'

import ReactDOM from 'react-dom'

import {Template} from 'meteor/templating'

import {Blaze} from 'meteor/blaze'

export default class AccountsUIWrapper extends Component {

    componentDidMount(){
        //use meteor blaze to render login buttons in to reactdom container
        this.view = Blaze.render(Template.loginButtons,ReactDOM.findDOMNode(this.refs.container))
    }

    componentWillUnmount(){
        //clear up blaze view
        Blaze.remove(this.view)
    }

    render(){
        //just render a placeholder container that will be filled in
        return <span ref='container'></span>
    }

}
