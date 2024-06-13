import { Beneficiario } from './../../../auth/interfaces/beneficiario-table.interface';
import { Component, ViewChild, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { BeneficiariosService } from '../../../auth/services/beneficiarios.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { RouterModule, Routes } from '@angular/router';





@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: ``
})
export class ListPageComponent {
  beneficiarios: Beneficiario[] = [];
  dataSource!: MatTableDataSource<Beneficiario>;
  @ViewChild(MatPaginator) paginator!: MatPaginator


  private AuthService = inject(AuthService);
  constructor(private beneficiariosService: BeneficiariosService) { }

  ngOnInit(): void {
    this.beneficiariosService.obtener_beneficiarios().subscribe(beneficiariosData => {
      this.beneficiarios = beneficiariosData.beneficiarios;
      this.dataSource = new MatTableDataSource(this.beneficiarios);
      if (this.dataSource) {
        this.dataSource.paginator = this.paginator;
      }
    })
  }

  ngAfterViewInit(): void {

    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }

  }

  displayedColumns: string[] = ['contador', 'superhero', 'first_appearance', 'publisher', 'actions'];

  applyFilter(event: Event) {

    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }

  onLogout() {
    this.AuthService.logout()
  }
}
