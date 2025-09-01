import { HomeComponent } from './home/home.component'
import { AboutComponent } from './about/about.component'
import { ProjectsComponent } from './projects/projects.component'
import { ContactComponent } from './contact/contact.component'

import { SedgwickComponent } from './sedgwick/sedgwick.component'
import { ShotmakerComponent } from './shotmaker/shotmaker.component'
import { ShotmakerProjectComponent } from './shotmaker/shotmaker-project.component'

import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'contact', component: ContactComponent },

  { path: 'sedgwick', component: SedgwickComponent },
  { path: 'shotmaker', component: ShotmakerComponent },
  { path: 'shotmaker/:projectId', component: ShotmakerProjectComponent },
  { path: 'shotmaker/:projectId/:tab', component: ShotmakerProjectComponent },
  { path: 'shotmaker/:projectId/:tab/:status', component: ShotmakerProjectComponent },
  { path: 'shotmaker/:projectId/:tab/:status/:shotId', component: ShotmakerProjectComponent },
];
