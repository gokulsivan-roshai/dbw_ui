/*

Copyright 2024 RoshAI Pvt Ltd.

 * This file is part of AutoDrive2.0.
 * 
 * AutoDrive2.0 can not be copied and/or distributed without the express
 * permission of RoshAI Pvt Ltd
File Name: app.module.ts
File Version: v 1.2
Purpose: UI for complimenting  DBW system with a UI console. Getting live data from DBW systems


Author: Gokul Sivan P
Owner : RoshAi
Product: AutoDrive UI v1.0




*/
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
