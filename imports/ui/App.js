import React, {
    Component
} from 'react'

import {Meteor} from 'meteor/meteor'

import {withTracker} from 'meteor/react-meteor-data'
//这里就是连接到数据库返回了一个collection
//所有对数据操作通过 对Tasks.find Tasks.insert...这些api来实现
//不需要写数据的连接操作 和 后端的api接口，前端就获取到了数据。
//meteor 自动完成了数据库的操作，并且和前端保持通信
import {Tasks} from '../api/tasks'

import Task from './Task.js'

import AccountsUIWrapper from './AccountsUIWrapper'

class App extends Component {

    constructor(props){
        super(props)
        this.state = {
            hideCompleted:false,
        }
    }

    handleSubmit(e){
        e.preventDefault()
        //find the text field via the react ref
        //如果使用html接口 querySelector（class）这样如果页面有多个组件，则会出现错误选择
        // let text = ReactDOM.findDOMNode(this.refs.textInput).value.trim()
        let text = this.textInput.value.trim()

        // Tasks.insert({
        //     text,
        //     createdAT:new Date(),
        //     owner:Meteor.userId(),
        //     username:Meteor.user().username,
        // })

        Meteor.call('tasks.insert',text)

        //clear form
        this.textInput.value = ''
    }

    renderTasks(){
        let filteredTasks = this.props.tasks

        if(this.state.hideCompleted){
            filteredTasks = filteredTasks.filter(task => !task.checked)
        }

        return filteredTasks.map(task=>{
            let currentUserId = this.props.currentUser && this.props.currentUser._id
            let showPrivateButton = task.owner === currentUserId

            return (
                <Task key={task._id} task={task} showPrivateButton={showPrivateButton}></Task>
            )
        })
    }

    toggleHideCompleted(){
        this.setState({
            hideCompleted:!this.state.hideCompleted
        })
    }

    render(){
        let incompleteCount = this.props.tasks.filter(task => task.checked).length
        return (
            <div className='container'>
                <header>
                    <h1>todo list （{incompleteCount}）</h1>
                    <label className='hide-completed'>
                        <input 
                            type='checkbox' 
                            readOnly 
                            checked={this.state.hideCompleted}
                            onClick={e=>this.toggleHideCompleted(e)}
                        />
                        Hide Completed Tasks
                    </label>
                </header>

                <AccountsUIWrapper></AccountsUIWrapper>

                <hr />
                {this.props.currentUser ? 
                    <form className='new-task' onSubmit={e=>this.handleSubmit(e)}>
                        <input type='text' ref={dom => this.textInput = dom} placeholder='type to add new tasks' />
                    </form>
                : ""}
                <hr />
                <ul>
                    {this.renderTasks()}
                </ul>
            </div>
        )
    }
}

export default withTracker(_=>{
    Meteor.subscribe('tasks')

    //这里类似把外部数据以props属性的形式，注入到App这个组件中
    return {
    //这就相当于一个数据的api请求，http.get(/gettasks,{filter:'/./',sort:{createdAT:-1}})
    tasks:Tasks.find({text:/./},{sort:{createdAT:-1}}).fetch(),
    currentUser:Meteor.user(),
    }
})(App)