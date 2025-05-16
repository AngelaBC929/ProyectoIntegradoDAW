import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { GalleryComponent } from './gallery/gallery.component';
import { ProfileComponent } from './profile/profile.component';
import { UserComponent } from './user/user/user.component';
import { ProximosRalliesComponent } from './rallies/proximos-rallies/proximos-rallies.component';
import { RalliesActualesComponent } from './rallies/rallies-actuales/rallies-actuales.component';
import { RalliesFinalizadosComponent } from './rallies/rallies-finalizados/rallies-finalizados.component';
import { AdminComponent } from './admin/admin/admin.component';
import { EditUserComponent } from './admin/edit-user/edit-user.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'user', component: UserComponent },
  { path: 'proximos-rallies', component: ProximosRalliesComponent },
  { path: 'rallies-actuales', component: RalliesActualesComponent },
  { path: 'rallies-finalizados', component: RalliesFinalizadosComponent },
  { path: 'admin', component: AdminComponent},
  { path: 'admin/edit-user/:id', component: EditUserComponent },
  { path: 'admin/rallies', loadComponent: () => import('./admin/manage-rallies/manage-rallies.component').then(m => m.ManageRalliesComponent)},
  { path: 'admin/user-control', loadComponent: () => import('./admin/user-control/user-control.component').then(m => m.UserControlComponent)},
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
