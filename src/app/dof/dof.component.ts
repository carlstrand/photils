import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { AppDataServics } from '../app-data.service';
import { Location } from '@angular/common';
import { DofVisualizerComponent } from './dof-visualizer/dof-visualizer.component';
import { LocalStorage } from 'ngx-store';

@Component({
  selector: 'app-dof',
  templateUrl: './dof.component.html',
  styleUrls: ['./dof.component.scss']
})
export class DofComponent implements OnInit, OnDestroy {
  @ViewChild(DofVisualizerComponent) dofVisualizer: DofVisualizerComponent;
  @LocalStorage() cachedSelection:any = { vendor: '',  model: ''}

  public dataModel = {vendor: '', model: '', aperture: 2.8, focalLength: 55, distance: 10, metric: true};
  public selectedModels:Array<any> = [];
  public apertures = [];
  public visualize = false;
  public result:DofCalculation =  new DofCalculation();

  constructor(public appDataService: AppDataServics, private location: Location) {
    if(this.dataModel.vendor !== '')
      this.selectVendor(null);

    for(let i = -1; i <= 12; i++) {
      for(let j = 0; j < 3; j++) {
        let av = (i + j/3.0);
        let dec_places = i < 6 ? 1 : 0;
        let aperture_third = Math.round(Math.sqrt(2**av) * 10) / 10;
        this.apertures.push(Number.parseFloat(aperture_third.toFixed(dec_places)));
      }
    }
  }

  // necessary for ngx-store
  ngOnDestroy() {}

  ngOnInit() {
    if(this.cachedSelection.vendor !== "" && this.cachedSelection.model !== "") {
      this.dataModel.vendor = this.cachedSelection.vendor;
      this.selectedModels = this.appDataService.getModels(this.dataModel.vendor);

      let idx;
      for(let i in this.selectedModels) {
        if(this.selectedModels[i].CameraModel === this.cachedSelection.model) {
          idx = i;
          break;
        }
      }
      this.dataModel.model = this.selectedModels[idx];
      this.calculateDof();
    }
  }


  public calculateDof() {
    let camera = this.dataModel.model;
    let sh = camera['SensorHeight(mm)'];
    let sw = camera['SensorWidth(mm)'];
    let d = Math.sqrt(sw**2 + sh**2);
    let CoC = d / 1500;

    let focalLength = this.dataModel.focalLength;
    let s = this.dataModel.distance * 1000; // convert m to mm

    this.result.calculate(
      focalLength, s,
      this.dataModel.aperture,
      CoC, this.dataModel.metric
    );

    if (this.dofVisualizer === undefined)
      return;

    if(!(sw > 35.5)) // is not fullframe
      focalLength *= Number((43.27 / d).toPrecision(2)); // full frame diagonal = 43.27

    let fov = 2 * Math.atan(sw / (2 * focalLength)); // in rad
    this.dofVisualizer.updateCamera(fov);

    this.dofVisualizer.updateDoF(
      this.dataModel.aperture,
      focalLength, s,this.result
    );
  }

  public selectVendor(evt:any) {
    this.selectedModels = this.appDataService.getModels(this.dataModel.vendor);
  }

  public selectModel(evt:any) {
    // if we have no default camera save the first selection
    if(this.cachedSelection.vendor === "" && this.cachedSelection.model === "") {
      this.cachedSelection.vendor = this.dataModel.vendor;
      this.cachedSelection.model = (this.dataModel.model as any).CameraModel;
      this.cachedSelection.save();
    }
    this.calculateDof();
  }
}

export class DofCalculation {
  public nearLimit: number;
  public farLimit: number;
  public hyperFocal: number;
  public DoF: number;
  public circleOfConfusion: number;
  public isReady = false;

  calculate(
    focalLength:number,
    subjectDistance: number,
    fstop:number,
    CoC:number,
    isMetric:boolean) {


    let H = focalLength + (focalLength ** 2) / (fstop * CoC); // Hyperfocal in mm
    let Hs = subjectDistance *  H;
    let Dn = Hs / (H + subjectDistance);
    let Df = Hs / (H - subjectDistance);
    let DoF = Df - Dn;


    let isInfinity = subjectDistance >= H ;

    let f = isMetric ? 1 : 3.2808;
    this.hyperFocal = (H / 1000.0) * f;
    this.nearLimit = (Dn / 1000.0) * f;
    this.farLimit =  isInfinity ? Infinity : (Df / 1000.0)  * f;
    this.DoF = isInfinity ? Infinity : (DoF / 1000.0)  * f;
    this.circleOfConfusion = CoC;
    this.isReady = true;

  }

  toString() {
    return {
      nearLimit: this.nearLimit,
      farLimit: this.farLimit,
      hyperFocal: this.hyperFocal,
      DoF: this.DoF,
      CoC: this.circleOfConfusion
    }
  }
}
