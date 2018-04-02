import React, {
    Component
} from 'react'

import {Tasks} from '../api/tasks'

import {Meteor} from 'meteor/meteor'

import classnames from 'classnames'

export default class Task extends Component {

    format(time, format){
        var t = new Date(time);
        var tf = function(i){return (i < 10 ? '0' : '') + i};
        return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
            switch(a){
                case 'yyyy':
                    return tf(t.getFullYear());
                    break;
                case 'MM':
                    return tf(t.getMonth() + 1);
                    break;
                case 'mm':
                    return tf(t.getMinutes());
                    break;
                case 'dd':
                    return tf(t.getDate());
                    break;
                case 'HH':
                    return tf(t.getHours());
                    break;
                case 'ss':
                    return tf(t.getSeconds());
                    break;
            }
        })
    }

    //set the checked property to the opposite of its current value
    toggleChecked(){
        //修改接口返回的collection中对应的数据
        // Tasks.update(this.props.task._id,{
        //     $set:{
        //         checked:!this.props.task.checked
        //     }
        // })

        Meteor.call('tasks.setChecked',this.props.task._id,!this.props.task.checked)
    }

    //delete current task
    deleteThisTask(){
        //删除接口返回的collection中对应的数据
        // Tasks.remove(this.props.task._id)
        Meteor.call('tasks.remove',this.props.task._id)
    }

    togglePrivate(){
        Meteor.call('tasks.setPrivate',this.props.task._id,!this.props.task.private)
    }
    
    render(){

        //give tasks a different classname when they are checked off
        //so that we can style them nicely in css
        let taskClassName = classnames({
            checked:this.props.task.checked,
            private:this.props.task.private,
        })
        
        return (
            //give tasks a different classname when they are checked off
            //so that we can style them nicely in css
            <li className={taskClassName}>
                <button className='delete' onClick={event => this.deleteThisTask(event)}>&times;</button>
                <input
                    type='checkbox'
                    readOnly
                    checked={!!this.props.task.checked}
                    onClick={e=>this.toggleChecked(e)}
                />

                {this.props.showPrivateButton ? (
                    <button className='toggle-private' onClick={e=>this.togglePrivate(e)}>
                    {this.props.task.private ? 'Private' : 'Public'}
                    </button>
                ) : ""}

                <span className='text'>
                    <strong>{this.props.task.username ? this.props.task.username : "unknow"}</strong>:{this.props.task.text}
                    <br />{this.format(this.props.task.createdAT, 'MM-dd  HH:mm:ss')}
                </span>
                
            </li>
        )
    }
}