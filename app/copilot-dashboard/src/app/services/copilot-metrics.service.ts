import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CopilotMetricsService {

  constructor(private http: HttpClient) { }

  getCopilotMetricsData(): Observable<any> {
    return new Observable(observer => {
      this.findMetricsFile().subscribe({
        next: data => {
          var filePath = 'assets/' + data.toString();
          this.http.get(filePath).subscribe({
            next: response => observer.next(response),
            error: err => observer.error(err)
          });
        },
        error: err => observer.error(err)
      });
    });
  }

  findMetricsFile(): Observable<string> {
    return this.http.get('assets/data.txt', { responseType: 'text' }).pipe(
      map(data => {
        const lines = data.split('\n');
        for (let line of lines) {
          if (line.startsWith('copilot_metrics') && line.endsWith('.json')) {
            return line;
          }
        }
        return "";
      })
    );
  }

  extractOrgName(): Observable<string> {
  return this.http.get('assets/data.txt', { responseType: 'text' }).pipe(
    map(data => {
      const firstLine = data.split('\n')[0];
      if (firstLine.startsWith('copilot_metrics') && firstLine.endsWith('.json')) {
        const orgName = firstLine.replace('copilot_metrics_', '').replace('.json', '');
        return orgName;
      }
      return "";
    })
  );
}

}
