import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { GalleryComponent } from './gallery/gallery.component';
import { ProximosRalliesComponent } from './rallies/proximos-rallies/proximos-rallies.component';
import { RalliesActualesComponent } from './rallies/rallies-actuales/rallies-actuales.component';
import { RalliesPasadosComponent } from './rallies/rallies-pasados/rallies-pasados.component';
import { AdminComponent } from './admin/admin/admin.component';
import { EditUserComponent } from './admin/edit-user/edit-user.component';
import { GestionRalliesComponent } from './admin/gestion-rallies/gestion-rallies.component';
import { EditRalliesComponent } from './admin/edit-rallies/edit-rallies.component';
import { CreateRalliesComponent } from './admin/create-rallies/create-rallies.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { AdminGuard } from './shared/guards/admin.guard';
import { UserGuard } from './shared/guards/user.guard';
import { MisRalliesComponent } from './user/mis-rallies/mis-rallies.component';
import { MisFotosComponent } from './user/mis-fotos/mis-fotos.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'user/dashboard',
    loadComponent: () => import('./user/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard, UserGuard]  // Aseguramos que esté autenticado y no sea un admin
  },
   { path: 'mis-rallies', component: MisRalliesComponent, canActivate: [AuthGuard, UserGuard] },
   { path: 'mis-fotos', component: MisFotosComponent, canActivate: [AuthGuard, UserGuard] },
  { path: 'proximos-rallies', component: ProximosRalliesComponent, canActivate: [AuthGuard, UserGuard] },
  { path: 'rallies-actuales', component: RalliesActualesComponent, canActivate: [AuthGuard, UserGuard] },
  { path: 'rallies-pasados', component: RalliesPasadosComponent, canActivate: [AuthGuard, UserGuard] },
  { path: 'admin/edit-user/:id', component: EditUserComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin/gestion-rallies', component: GestionRalliesComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin/create-rallies', component: CreateRalliesComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin/edit-rallies/:id', component: EditRalliesComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin/user-control', 
    loadComponent: () => import('./admin/user-control/user-control.component').then(m => m.UserControlComponent), 
    canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
