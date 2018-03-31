import React, {
    Component
} from 'react'

// import ReactDOM from 'react-dom'


import {withTracker} from 'meteor/react-meteor-data'
//这里就是连接到数据库返回了一个collection
//所有对数据操作通过 对Tasks.find Tasks.insert...这些api来实现
//不需要写数据的连接操作 和 后端的api接口，前端就获取到了数据。
//meteor 自动完成了数据库的操作，并且和前端保持通信
import {Tasks} from '../api/tasks'

import Task from './Task.js'

class App extends Component {

    handleSubmit(e){
        e.preventDefault()
        //find the text field via the react ref
        //如果使用html接口 querySelector（class）这样如果页面有多个组件，则会出现错误选择
        // let text = ReactDOM.findDOMNode(this.refs.textInput).value.trim()
        let text = this.textInput.value.trim()

        Tasks.insert({
            text,
            createdAT:new Date()
        })

        //clear form
        this.textInput.value = ''
    }

    renderTasks(){
        return this.props.tasks.map(task=><Task key={task._id} task={task}></Task>)
    }

    render(){
        return (
            <div className='container'>
                <header>
                    <h1>todo list</h1>
                </header>
                <form className='new-task' onSubmit={e=>this.handleSubmit(e)}>
                    <input type='text' ref={dom => this.textInput = dom} placeholder='type to add new tasks' />
                </form>
                <ul>
                    {this.renderTasks()}
                </ul>
            </div>
        )
    }
}

export default withTracker(_=>{
    return {
    tasks:Tasks.find({text:/./},{sort:{createdAT:-1}}).fetch()
    }
})(App)