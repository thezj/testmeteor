import {Mongo} from "meteor/mongo"
import {Meteor} from "meteor/meteor"
import {check} from "meteor/check"


export const Tasks = new Mongo.Collection('tasks')

if(Meteor.isServer){
    //this code only runs on the server
    //only publish tasks that are public or belong to the current user
    Meteor.publish('tasks',function tasksPublication(){
        return Tasks.find({
            $or:[
                {private:{$ne:true}},
                {owner:this.userId},
            ]
        })
    })
}

Meteor.methods({

    'tasks.insert'(text){
        check(text,String);

        //make sure the user is logged in before inserting a task
        if(!this.userId){
            throw new Meteor.Error('not-authorized')
        }

        Tasks.insert({
            text,
            createdAT:new Date(),
            owner:this.userId,
            username:Meteor.users.findOne(this.userId).username
        })

    },

    'tasks.remove'(taskId){
        check(taskId,String);

        let task = Tasks.findOne(taskId)

        if(!task.private || task.owner === this.userId){
            Tasks.remove(taskId)
        }else{
            throw new Meteor.Error('not-authorized')
        }
        
    },

    'tasks.setChecked'(taskId,setChecked){
        check(taskId,String);
        check(setChecked,Boolean);

        let task = Tasks.findOne(taskId)

        if(!task.private || task.owner === this.userId){
            Tasks.update(taskId,{$set:{checked:setChecked}})
        }else{
            throw new Meteor.Error('not-authorized')
        }

        
    },
    
    'tasks.setPrivate'(taskId,setToPrivate){
        check(taskId,String);
        check(setToPrivate,Boolean);
        
        let task = Tasks.findOne(taskId)
        
        //make sure only the task owner can make a task private
        if(task.owner !== this.userId){
            throw new Meteor.Error('not-authorized')
        }

        Tasks.update(taskId,{$set:{private:setToPrivate}})
    },
})