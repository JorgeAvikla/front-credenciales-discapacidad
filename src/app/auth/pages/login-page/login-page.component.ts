import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login.page.css'
})
export class LoginPageComponent {
  public myform: FormGroup = this.fb.group({
    usuario: ['jorgeavila', [Validators.required]],
    password: ['123456789', [Validators.required]]
  })
  private AuthService = inject(AuthService);
  private router = inject(Router);





  constructor(private fb: FormBuilder) { }
  onValidate() {
    if (this.myform.invalid) {
      this.myform.markAllAsTouched();
      return;
    };
    const { usuario, password } = this.myform.value;
    this.AuthService.login(usuario, password)
      .subscribe({
        next: () => this.router.navigateByUrl('/usuarios/lista'),
        error: (message) => {
          Swal.fire('Error', message.error, 'error');
        }
      })
    // this.myform.reset();
  }
}


