import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  apiUrl = 'http://localhost:2627/api/employees';

  employees: any[] = [];

  employee = {
    id: null as number | null,
    name: '',
    age: null as number | null,
    salary: null as number | null,
    design: ''
  };

  message = '';

  constructor(private http: HttpClient) {
    this.getEmployees();
  }

  // Get all employees
  getEmployees() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.employees = data;
      },
      error: () => {
        this.message = 'Unable to connect to Spring Boot backend';
      }
    });
  }

  // Add employee
  addEmployee() {

    if (
      !this.employee.id ||
      !this.employee.name ||
      !this.employee.age ||
      !this.employee.salary ||
      !this.employee.design
    ) {
      this.message = 'Please fill all fields';
      return;
    }

    this.http.post(this.apiUrl, this.employee).subscribe({
      next: () => {
        this.message = 'Employee added successfully';
        this.clearForm();
        this.getEmployees();
      },
      error: () => {
        this.message = 'Error while adding employee';
      }
    });
  }

  // Select employee for updating
  editEmployee(emp: any) {

    this.employee = {
      id: emp.id,
      name: emp.name,
      age: emp.age,
      salary: emp.salary,
      design: emp.design
    };

    this.message = 'Employee selected for update';
  }

  // Update employee
  updateEmployee() {

    if (!this.employee.id) {
      this.message = 'Select an employee first';
      return;
    }

    this.http.put(
      this.apiUrl + '/' + this.employee.id,
      this.employee
    ).subscribe({
      next: () => {
        this.message = 'Employee updated successfully';
        this.clearForm();
        this.getEmployees();
      },
      error: () => {
        this.message = 'Error while updating employee';
      }
    });
  }

  // Delete employee
  deleteEmployee(id: number) {

    if (!confirm('Do you want to delete this employee?')) {
      return;
    }

    this.http.delete(this.apiUrl + '/' + id).subscribe({
      next: () => {
        this.message = 'Employee deleted successfully';
        this.getEmployees();
      },
      error: () => {
        this.message = 'Error while deleting employee';
      }
    });
  }

  // Clear form
  clearForm() {

    this.employee = {
      id: null,
      name: '',
      age: null,
      salary: null,
      design: ''
    };
  }
}