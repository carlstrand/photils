import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main/main.component';
import { DofComponent } from './dof/dof.component';
import { ExposureComponent } from './exposure/exposure.component';
import { InspirationComponent } from './inspiration/inspiration.component';
import { SunComponent } from './sun/sun.component';
import { AutoTaggerComponent } from './auto-tagger/auto-tagger.component';
import { AboutComponent } from './about/about.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  { path: '', component: MainComponent, data: { state: 'main' } },
  { path: 'sun', component: SunComponent , data: { state: 'sun' }},
  { path: 'dof', component: DofComponent , data: { state: 'dof' }},
  { path: 'exposure', component: ExposureComponent , data: { state: 'exposure' }},
  { path: 'inspiration', component: InspirationComponent , data: { state: 'inspiration' }},
  { path: 'autotagger', component: AutoTaggerComponent , data: { state: 'autotagger' }},
  { path: 'about', component: AboutComponent , data: { state: 'about' }},
  { path: 'settings', component: SettingsComponent , data: { state: 'settings' }},
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: false }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
