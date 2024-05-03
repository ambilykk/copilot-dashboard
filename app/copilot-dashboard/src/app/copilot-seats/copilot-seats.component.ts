import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { Sort } from '@angular/material/sort';
import { CopilotSeatsService } from '../services/copilot-seats.service';
import { CopilotMetricsService } from '../services/copilot-metrics.service';

@Component({
  selector: 'app-copilot-seats',
  templateUrl: './copilot-seats.component.html',
  styleUrl: './copilot-seats.component.scss'
})
export class CopilotSeatsComponent {

  public chart: any;
  orgName: any = "";
  data: any = [];
  seatDetails: any ;

  // data source for table
  seatInformation: any;
  page:number = 1;

  constructor(private copilotSeatsService: CopilotSeatsService, private copilotMetricsService: CopilotMetricsService) { }

  ngOnInit(): void {
   // this.orgName = environment.orgName;
    // create chart
    this.createChart();
  }

  createChart(){

    var xLabel=['Active','Inactive'];
    var users=[0,0];

    // get orgname
    this.copilotMetricsService.extractOrgName().subscribe((data: any) => {
      this.orgName = data;
    });

    // get data from service
    this.copilotSeatsService.getCopilotSeatsData().subscribe((data: any) => {
      // console.log(data);
      this.data = data;
      sessionStorage.setItem('orgData', JSON.stringify(data));
      this.seatInformation = data;
      // calculate active and inactive users
      this.data.forEach((element: any) => {
        if (element.last_activity_at && element.last_activity_at.trim() !== '') {
          users[1]++;
        }
        else{
          users[0]++;
        }
      });

      this.seatDetails=[
        {category: 'Total Seat', value: this.data.length, desc: 'Total number of seats purchased'},
        {category: 'Active Users', value: users[1], desc: 'Total number of active users'},
        {category: 'Inactive Users', value: users[0], desc: 'Total number of inactive users'}
      ];
      
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    if (a === null) return isAsc ? -1 : 1;
    if (b === null) return isAsc ? 1 : -1;  
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  sortData(sort: Sort) {
    const data = this.seatInformation.slice();
    if (!sort.active || sort.direction === '') {
      this.seatInformation = data;
      return;
    }

    this.seatInformation = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'user': return this.compare(a.assignee.login, b.assignee.login, isAsc);
        case 'createDate': return this.compare(a.created_at, b.created_at, isAsc);
        case 'updatedDate': return this.compare(a.updated_at, b.updated_at, isAsc);
        case 'lastActivityDate': return this.compare(a.last_activity_at, b.last_activity_at, isAsc);
        case 'lastActivityEditor': return this.compare(a.last_activity_editor, b.last_activity_editor, isAsc);
        case 'pendingCancellation': return this.compare(a.pending_cancellation_date, b.pending_cancellation_date, isAsc);
        default: return 0;
      }
    });
  }
}

