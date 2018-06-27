import 'hammerjs';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatSelectModule } from '@angular/material/select';
import { 
  MatCardModule, 
  MatDividerModule, 
  MatFormFieldModule, 
  MatInputModule, 
  MatGridListModule, 
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatSliderModule,
  MatSlideToggleModule,  
  MatProgressSpinnerModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { DofComponent } from './dof/dof.component';
import { ExposureComponent } from './exposure/exposure.component';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './/app-routing.module';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { DofVisualizerComponent } from './dof/dof-visualizer/dof-visualizer.component';
import { ArSphereComponent } from './ar-sphere/ar-sphere.component';
import { InspirationComponent } from './inspiration/inspiration.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    DofComponent,
    ExposureComponent,
    MainComponent,
    DofVisualizerComponent,
    ArSphereComponent,
    InspirationComponent
  ],
  imports: [          
    BrowserModule,    
    BrowserAnimationsModule,
    CommonModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatInputModule,
    MatDividerModule,            
    FormsModule,
    MatDividerModule,
    MatGridListModule,
    MatCardModule,
    MatSelectModule,
    MatCardModule,
    MatSelectModule,
    MatSliderModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    FlexLayoutModule,      
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [{provide: Window, useValue: window }],
  bootstrap: [AppComponent]
})
export class AppModule { }
