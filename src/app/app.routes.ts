import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { GalleryComponent } from './gallery/gallery.component';
import { ProfileComponent } from './profile/profile.component';
import { ProximosRalliesComponent } from './rallies/proximos-rallies/proximos-rallies.component';
import { RalliesActualesComponent } from './rallies/rallies-actuales/rallies-actuales.component';
import { RalliesPasadosComponent } from './rallies/rallies-pasados/rallies-pasados.component';
import { AdminComponent } from './admin/admin/admin.component';
import { EditUserComponent } from './admin/edit-user/edit-user.component';
import { GestionRalliesComponent } from './admin/gestion-rallies/gestion-rallies.component';
import { EditRalliesComponent } from './admin/edit-rallies/edit-rallies.component';
import { CreateRalliesComponent } from './admin/create-rallies/create-rallies.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'profile', component: ProfileComponent },
  {path: 'user/dashboard', loadComponent: () => import('./user/dashboard/dashboard.component').then(m => m.DashboardComponent)},
  { path: 'proximos-rallies', component: ProximosRalliesComponent },
  { path: 'rallies-actuales', component: RalliesActualesComponent },
  { path: 'rallies-pasados', component: RalliesPasadosComponent },
  { path: 'admin', component: AdminComponent},
  { path: 'admin/edit-user/:id', component: EditUserComponent },
  { path: 'admin/gestion-rallies', component: GestionRalliesComponent },
  { path: 'admin/create-rallies', component: CreateRalliesComponent },
  { path: 'admin/edit-rallies/:id', component: EditRalliesComponent },
  { path: 'admin/user-control', loadComponent: () => import('./admin/user-control/user-control.component').then(m => m.UserControlComponent)},
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
