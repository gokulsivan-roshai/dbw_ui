/*

Copyright 2024 RoshAI Pvt Ltd.

 * This file is part of AutoDrive2.0.
 * 
 * AutoDrive2.0 can not be copied and/or distributed without the express
 * permission of RoshAI Pvt Ltd.
File Name: main.ts
File Version: v 1
Purpose: UI for complimenting  DBW system with a UI console. Getting live data from DBW systems


Author: Gokul Sivan P
Owner : RoshAi
Product: AutoDrive UI v1.0




*/

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
