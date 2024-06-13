import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styles: ``
})
export class LayoutPageComponent {

  public user = computed(() => this.AuthService.currentUser());

  public menuItems: any[] = [{

    titulo: 'Dashboard',
    icono: 'nav-icon fas fa-tachometer-alt',
    link: '',
    submenu: [
      // { titulo: 'DataTable', url: 'heroes', icon: 'far fa-circle' },
      // { titulo: 'Toaster', url: 'toaster', icon: 'far fa-circle' },
    ]



  },
  {
    titulo: 'Nuevo beneficiario',
    icono: 'nav-icon fas fa-tachometer-alt',
    link: 'nuevo',

    submenu: [
      // { titulo: 'DataTable', url: 'heroes', icon: 'far fa-circle' },
      // { titulo: 'Toaster', url: 'toaster', icon: 'far fa-circle' },
    ]
  }
  ];



  private AuthService = inject(AuthService);
  onLogout() {
    this.AuthService.logout()
  }
}
