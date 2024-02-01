import { Component, OnInit, OnDestroy } from '@angular/core';
import ROSLIB, { Ros, Topic} from 'roslib';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'dbw_ui';
  acceleratorData : any ='0%';
  brakeData : any ='0%';
  steeringData :any ='0°';
  stateDBW : any ='STATE';
  modeDBW : any ='J/V';
  rosData: string = '';
  private ros: any;
  makeCar: any ='MAKE';
  ipAddr: any ='000.000.0.0';
  version : any ='0.0.00';
  nerr : any ='';
  iferr : any='';
  private destroy$ = new Subject<void>();
  
  accTopic : any;
  brakeTopic: any;
  steerTopic: any;
  dbModeTopic: any;
  topicState: any;
  otherTopic: any;
  batteryPercentTopic: any;
  batteryPercentage :any;
  

  ngOnInit(): void {
    this.ros = new Ros();
    this.ros.autoConnect = false;
    
    this.ros.connect('ws://192.168.1.154:9090');
    this.ros.on('connection', function () {
      console.log('Connected!')
     
    })
    this.ros.on('close', function () {
      console.log('Connection closed')
      
    })

    this.accTopic = new ROSLIB.Topic({
      ros: this.ros,
      name: '/accelerator_pedal_report',
      messageType: 'roshai_dbw_interface/msg/AcceleratorPedalReport',
    })
    this.brakeTopic = new ROSLIB.Topic({
      ros: this.ros,
      name: '/brake_report',
      messageType: 'roshai_dbw_interface/msg/BrakeReport',
    })
    this.steerTopic = new Topic({
      ros: this.ros,
      name: '/steering_report', 
      messageType: 'roshai_dbw_interface/msg/SteeringReport',
    })
    this.dbModeTopic= new ROSLIB.Topic({
      ros: this.ros,
      name: '/dbw_mode', 
      messageType: 'roshai_dbw_interface/msg/SystemMode',
    })
    this.topicState = new ROSLIB.Topic({
      ros: this.ros,
      name: '/dni_interface', 
      messageType: 'roshai_dbw_interface/msg/DriverNotificationInterface',
    })
    this.otherTopic = new Topic({
      ros: this.ros,
      name: '/heart_pulse_report', //add topic
      messageType: 'roshai_dbw_interface/msg/HeartPulseReport',
    })
    this.batteryPercentTopic = new ROSLIB.Topic({
      ros: this.ros,
      name: '/bms_data_soc', 
      messageType: 'roshai_dbw_interface/msg/BmsSoc',
    })
   
    this.getAcceleratorData();
    this.getSteeringData();
    this.getBrakeData();
    this.getDBWMode();
    this.getState();  
    this.getOtherCodes();
    this.getBatteryLevel();

  }
 
  fetchLatestData(){
    this.getAcceleratorData();
    this.getBrakeData();
    this.getDBWMode();
    this.getState();
    this.getSteeringData;
    this.getOtherCodes;
  }
  // private subscribeToTopic(topicName: string, callback: (data: any) => void): void {
  //   const topic = new Topic({
  //     ros: this.ros,
  //     name: topicName,
  //     messageType: 'std_msgs/msg/Float64',
  //   });

  //   topic.subscribe(callback);
  // }

  getAcceleratorData() {
    console.log('going acc')
    this.accTopic.subscribe((message: any) =>  {
      console.log('acclerator: '+message.position_target)
        this.acceleratorData= message.position_target + '%'
    });
  }
  getBrakeData(){
    console.log('going brake')
    this.brakeTopic.subscribe((message: any) => {
      // console.log('brakeData: '+message)
      // try {
      //   if (message && message.data) {
          this.brakeData = message.position_target+ '%';
    //     } else {
    //       throw new Error('Unexpected message format');
    //     }
    //   } catch (error) {
    //     console.error('Error processing message:', error);
    //   }
    });
  }
  getSteeringData(){
    this.steerTopic.subscribe((message: any) => { 
      console.log('steeringData: '+message)
          this.steeringData = message.position_target+ '°'; 
    });
  }
  getDBWMode(){
    console.log("dbw")
    this.dbModeTopic.subscribe((message: any) => 
    {
      // if(message.dbw_mode==0){
      //   this.modeDBW = 'WAIT';
      // }
      // else if(message.dbw_mode==1){
      //   this.modeDBW = "AV"
      // }
      // else if(message.dbw_mode==2){
      //   this.modeDBW = "JOY"
      // }
      // else {
      //   this.modeDBW = "NONE"
      // }
      
      switch(message.dbw_mode){
        case 0:
          this.modeDBW = 'WAIT';
          break
        case 1:
          this.modeDBW = "AV"
          break
        case 2:
          this.modeDBW = 'JOY'
          break
        default:
            this.modeDBW = '---'
            break;
      }
         
    });
  }

  getState(){   
    this.topicState.subscribe((message: any) => {  
      console.log('stateDBW: '+ message)
      switch(message.state_code) {
        case 0:
          this.stateDBW = 'IDLE';
          break
        case 1:
          this.stateDBW = 'CALIBRATION'
          break;
        case 2:
        this.stateDBW = 'EMERGENCY';
            break;
      
        case 3:
          this.stateDBW = 'DRIVE';
            break;
      
          case 4:
            this.stateDBW = 'RESET';
            break;
      
          case 4:
            this.stateDBW = 'MANUAL';
            break;
      
          case 5:
            this.stateDBW = 'CRITICALFAULT';
            break;
      
          case 6:
            this.stateDBW = 'NONCRITICALFAULT';
            break;
      
          case 7:
            this.stateDBW = 'NEMERGENCY';
            break;
      
          case 8:
            this.stateDBW = 'DOCALIBRATION';
            break;
      
          case 9:
            this.stateDBW = 'MULTIDEVICESELECTED';
            break;
      
          case 10:
            this.stateDBW = 'VEHICLESTOPREQUIRED';
            break;
      
          case 11:
            this.stateDBW = 'SYSTEMREADYINDICATION';
            break;
      
          default:
            this.stateDBW = '---'
            break;
 
      }
      
      


    
    });
  }


  getOtherCodes(){
    this.otherTopic.subscribe((message: any) => {
      console.log('getOtherCodes: '+message)
      // try {
      //   if (message && message.data) {
        this.nerr=this.iferr='';
          this.makeCar = message.dbw_vehiclemodel;
          this.ipAddr = message.dbw_ip;
          this.version = 'v'+ message.dbw_version;
          if(message.node_error){
            this.nerr='NERR'
          }
          if(message.interface_error){
            this.iferr='IFERR'
          }    
    });  
  }
  getBatteryLevel(){
    this.batteryPercentTopic.subscribe((message: any) => { 
      this.batteryPercentage=message.battery_stateofcharge
        console.log(message.battery_stateofcharge)

     })
  } 
}
// }


// Topics: 
// /steering_report
// /brake_report
// /heart_pulse_report
// /dbw_state
// /dbw_mode
// /accelerator_pedal_report
