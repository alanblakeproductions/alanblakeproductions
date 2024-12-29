import { HomeComponent } from './home/home.component'
import { AboutComponent } from './about/about.component'
import { ProjectsComponent } from './projects/projects.component'
import { ContactComponent } from './contact/contact.component'

import { SedgwickComponent } from './sedgwick/sedgwick.component'
import { I80Component } from './i80/i80.component'

import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'contact', component: ContactComponent },

  { path: 'sedgwick', component: SedgwickComponent },
  { path: 'i-80', component: I80Component },
];
