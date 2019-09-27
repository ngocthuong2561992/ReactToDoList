import React, { Component } from 'react';
import './App.css'
import TaskForm from './components/TaskForm';
import Control from './components/Control';
import TaskList from './components/TaskList'
import _ from 'lodash';
import axios from 'axios';
import callApi from './utils/apiCaller';
class App extends Component {

  constructor(props){
		super(props);
		this.state={
			tasks:[],
			isDisplayForm: false,
			taskEditing:null,
			filter :{
				name : '',
				sex : -1,
				department:'',
				email :'',
			},
			keyword : '',
			// sort: {
			// 	by: sortBy,
			// 	value: sortValue
			// 	}
		}
  }
  componentWillMount() {
	   console.log("componentWillMount");
		callApi('employee','GET',null).then(res=>{
			this.setState({
				tasks:res.data
			});
		});

   }
   


//   componentWillMount(){
// 		if(localStorage && localStorage.getItem('tasks')){
// 			var tasks=JSON.parse(localStorage.getItem('tasks'));
// 			this.setState({
// 				tasks:tasks
// 			});
// 		}
//   }
  
//   onGenerateData = ()=>{
// 		var tasks= [
// 		{
// 			id :this.generateID(),
// 			name : 'Nguyen Thi Dieu Linh',
// 			sex : true,
// 			email : 'dieulinh246@gmail.com',
// 			department : 'IT'
// 		},
// 	    {
// 			id :this.generateID(),
// 			name : 'Pham Ngoc Thuong',
// 			sex : false,
// 			email : 'ngocthuong2561992@gmail.com',
// 			department : 'IT'
// 		},
// 		{
// 			id :this.generateID(),
// 			name : 'Pham Ngoc Thong',
// 			sex : false,
// 			email : 'ngocthong12041993@gmail.com',
// 			department : 'IT'
// 		},
// 		];
// 		this.setState({
// 			tasks : tasks
//     } );
//     localStorage.setItem('tasks',JSON.stringify(tasks));
//   }
  s4(){
		return Math.floor((1+Math.random()) * 0x10000).toString(16).substring(1);
  }
  
   generateID(){
		return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4
		()+'-' + this.s4() + this.s4() + this.s4();
	}

	onToggleForm =() => { 	
		//Them task 
		if(this.state.isDisplayForm && this.state.taskEditing!=null){
			console.log('th1');
			this.setState({
				isDisplayForm:true,
	            taskEditing:null
			});
		}else{
			this.setState({
				isDisplayForm:!this.isDisplayForm,
				taskEditing:null
			});
		}
		
	}
		
	onCloseForm=()=>{
		this.setState({
			isDisplayForm:false
		});
	}

	onSubmit=(data)=>{
		var {tasks}=this.state;
		if(data.id===''){
		   callApi('employee','POST',{
			name : data.name,
			sex : data.sex,
			department:data.department,
			email :data.email,
        }).then(res => {
        //  history.goBack();
       });
			// data.id=this.generateID();
			tasks.push(data);
		}else{
			var index=this.findIndex(data.id);
			callApi(`employee/${data.id}`,'PUT',{
				name : data.name,
				sex : data.sex,
				department:data.department,
				email :data.email,
			}).then(res => {
			//   history.goBack();
			 });
			tasks[index]=data;
		}		
		// tasks.push(data);
		this.setState({
			tasks:tasks,
		});
		// localStorage.setItem('tasks',JSON.stringify(tasks));

	}

	findIndex=(id)=>{
		var {tasks}=this.state;
		var result=-1;
		tasks.forEach((task,index)=>{
			if(task.id===id){
				return result=index;
			}
		});
		return result;
	}
	
	onDelete=(id)=>{
		var {tasks}=this.state;
		var index=this.findIndex(id);

		if(confirm('You are sure ?')){  //eslint-disable-line
		    callApi(`employee/${id}`,'DELETE',null).then(res=>{
           if(res.status===200){ //OK.
              var index=this.findIndex(id);
             if(index!==-1){
				tasks.splice(index,1);
              this.setState({
                tasks:tasks
              });
              }
           }
         });
		}

		// if(index!==-1){
		// 	tasks.splice(index,1);
		// 	this.setState({
		// 		tasks:tasks
		// 	});
			
		// 	// localStorage.setItem('tasks',JSON.stringify(tasks));
		// }
		this.onCloseForm();
		
	}

	onUpdate=(id)=>{
		var {tasks}=this.state;
		var index=this.findIndex(id);
		var taskEditing=tasks[index];
		if(index!==-1){
			this.setState({
				taskEditing:taskEditing
			});
			localStorage.setItem('tasks',JSON.stringify(tasks));
		}
		this.onShowForm();
		
	}
	onShowForm=()=>{
		this.setState({
			isDisplayForm:true
		});
	}

	onFilter=(filterName,filterSex,filterEmail,filterDepartment)=>{
		// console.log(filterName,'-',filterStatus);
		filterSex=parseInt(filterSex,10);
		this.setState({
			filter :{
				name:filterName.toLowerCase(),
				sex : filterSex,
				email:filterEmail.toLowerCase(),
				department:filterDepartment.toLowerCase(),
			   }
			});
	}

	onSearch=(keyword)=>{
		console.log(keyword);
		this.setState({
			keyword:keyword
		});
	}
	

	render (){

	console.log("render");
	var {tasks,isDisplayForm,taskEditing,filter,keyword}=this.state;

	if(filter){
		if(filter.name){
			tasks=_.filter(tasks,(task)=>{
			return task.name.toLowerCase().indexOf(filter.name)!==-1
			});
		}

		if(filter.sex){
			tasks=_.filter(tasks,(task)=>{
			 if(filter.sex===-1){
				 return task;
			 }else{
				return task.sex===
				(filter.sex===0? 0:1)
			 }
			});
		}

		if(filter.email){
			tasks=_.filter(tasks,(task)=>{
			return task.email.toLowerCase().indexOf(filter.email)!==-1
			});
		}

		if(filter.department){
			tasks=_.filter(tasks,(task)=>{
			return task.department.toLowerCase().indexOf(filter.department)!==-1
			});
		}
	}

	if(keyword){
		tasks=_.filter(tasks,(task)=>{
			return task.name.toLowerCase().indexOf(keyword)!==-1
	});
	}

	var elmTaskForm=isDisplayForm 
		? <TaskForm 
		               onSubmit={this.onSubmit}
					   onCloseForm={this.onCloseForm}
					   task={taskEditing}	/>:'';


   return (
      <div className="container">
      <div className="text-center">
			   <h1>Manage Employee</h1>
	  </div>
	  <div className="row">
	  <div className={isDisplayForm?
			 'col-xs-4 col-sm-4 col-md-4 col-lg-4':''}>  
			  {elmTaskForm}
	  </div> 
      <div className={isDisplayForm?'col-xs-8 col-sm-8 col-md-8 col-lg-8': 'col-xs-12 col-sm-12 col-md-12 col-lg-12'}>
	  <button 
	   		type="button" 
			className="btn btn-primary" 
			onClick={this.onToggleForm}>
			Add Emloyee
	  </button>
	  {/* <button 
	  		type="button" 
			className="btn btn-danger" 
			onClick={this.onGenerateData}>
			Generate data</button> */}
      <Control 
	  		onSearch={this.onSearch}  
		/>
				 {/* List */}
	  <TaskList 
			 tasks={tasks} 
			 onDelete={this.onDelete}  
			 onUpdate={this.onUpdate}
			 onFilter={this.onFilter}
						   />
      </div>
      </div>
    </div>
    );
 }
	
}

export default App;