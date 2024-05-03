import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
  }
  gotoHome() {
    this.router.navigate(['']);
  }
  gotoMetrics() {
    this.router.navigate(['/copilot-usage']);
  }
  gotoSeatUsage() {
    this.router.navigate(['/copilot-seats']);
  }
}
