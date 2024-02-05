/*

Copyright 2024 RoshAI Pvt Ltd.

 * This file is part of AutoDrive2.0.
 * 
 * AutoDrive2.0 can not be copied and/or distributed without the express
 * permission of RoshAI Pvt Ltd.
 *File Name: app.component.ts
 *File Version: v 1.2
 *Purpose: UI for complimenting  DBW system with a UI console. Getting live data from DBW systems


Author: Gokul Sivan P
Owner : RoshAi
Product: AutoDrive UI v1.0




*/


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
  imagesrc: string;
  chargePercent: any ="0";
  

  ngOnInit(): void {
    this.ros = new ROSLIB.Ros({});
    this.ros.autoConnect = false;
    
    this.ros.connect('ws://127.0.0.1:9090');
    this.ros.on('connection', function () {
      console.log('Connected!')
     
    })
    this.ros.on('close', function () {
      console.log('Connection closed')
      
    })

    this.accTopic = new ROSLIB.Topic({
      ros: this.ros,
      name: '/accelerator_pedal_report',    //New topic object for accelerator
      messageType: 'roshai_dbw_interface/msg/AcceleratorPedalReport',
    })
    this.brakeTopic = new ROSLIB.Topic({
      ros: this.ros,
      name: '/brake_report',                 //New topic object for brakes
      messageType: 'roshai_dbw_interface/msg/BrakeReport',
    })
    this.steerTopic = new Topic({
      ros: this.ros,
      name: '/steering_report',             //New topic object for steering
      messageType: 'roshai_dbw_interface/msg/SteeringReport',
    })
    this.dbModeTopic= new ROSLIB.Topic({
      ros: this.ros,
      name: '/dbw_mode',                     //New topic object for dbwMode  
      messageType: 'roshai_dbw_interface/msg/SystemMode',
    })
    this.topicState = new ROSLIB.Topic({
      ros: this.ros,
      name: '/dni_interface',                 //New topic object for dbwState
      messageType: 'roshai_dbw_interface/msg/DriverNotificationInterface',
    })
    this.otherTopic = new Topic({
      ros: this.ros,
      name: '/heart_pulse_report',             //New topic object for others- errors, ipaddress, version, vehiclemodel
      messageType: 'roshai_dbw_interface/msg/HeartPulseReport',
    })
    this.batteryPercentTopic = new ROSLIB.Topic({
      ros: this.ros,
      name: '/bms_data_soc',                    //New topic object for battery percentage and ifCharging(need to implement)
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


  getAcceleratorData() {              //accelerator
    console.log('going acc')
    this.accTopic.subscribe((message: any) =>  {
      console.log('acclerator: '+message.position_target)
        this.acceleratorData= parseFloat((message.position_target).toFixed(2)) + '%'
    });
  }
  getBrakeData(){                    //Brake
    console.log('going brake')
    this.brakeTopic.subscribe((message: any) => {
          this.brakeData =  parseFloat((message.position_target).toFixed(2)) + '%';
    });
  }
  getSteeringData(){
    this.steerTopic.subscribe((message: any) => { 
      console.log('steeringData: '+message)
          this.steeringData =  parseFloat((message.position_target).toFixed(2)) + '°'; 
    });
  }
  getDBWMode(){                     //DBWMode
    console.log("dbw")
    this.dbModeTopic.subscribe((message: any) => 
    {     
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

  getState(){                       //State
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


  getOtherCodes(){                 //errors, ipaddress, version, vehiclemodel
    this.otherTopic.subscribe((message: any) => {
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
  getBatteryLevel(){              //BatteryLevel
    this.batteryPercentTopic.subscribe((message: any) => {
      if(message.battery_chargerconnect='0'){
          if(message.battery_stateofcharge>80){
            this.imagesrc= '../assets/batteryfull.png'; 
          }
          else if(message.battery_stateofcharge<80 && message.battery_stateofcharge>60){
            this.imagesrc= '../assets/battery6080.png';
          }
          else if(message.battery_stateofcharge<60 && message.battery_stateofcharge>40){
            this.imagesrc= '../assets/batteryhalf.png';
          }
          else if(message.battery_stateofcharge<40 && message.battery_stateofcharge>20){
            this.imagesrc= '../assets/battery2040.png';
          }
          else if(message.battery_stateofcharge<20){
            this.imagesrc= '../assets/batterylow.png';
          }
          else {
            this.imagesrc = '../assets/default.png';
          }
        }
      else{
          this.imagesrc ='../assets/batterycharge.png'
      }
          this.chargePercent = message.battery_stateofcharge + "%";
        })
  } 
}