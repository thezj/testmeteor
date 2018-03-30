import React, {
    Component
} from 'react'

import {withTracker} from 'meteor/react-meteor-data'
//这里就是连接到数据库返回了一个collection
//所有对数据操作通过 对Tasks.find Tasks.insert...这些api来实现
//不需要写数据的连接操作 和 后端的api接口，前端就获取到了数据。
//meteor 自动完成了数据库的操作，并且和前端保持通信
import {Tasks} from '../api/tasks'

import Task from './Task.js'

class App extends Component {

    renderTasks(){
        return this.props.tasks.map(task=><Task key={task._id} task={task}></Task>)
    }

    render(){
        return (
            <div className='container'>
                <header>
                    <h1>todo list</h1>
                </header>
                <ul>
                    {this.renderTasks()}
                </ul>
            </div>
        )
    }
}

export default withTracker(_=>{
    return {
    tasks:Tasks.find({text:/11/}).fetch()
    }
})(App)