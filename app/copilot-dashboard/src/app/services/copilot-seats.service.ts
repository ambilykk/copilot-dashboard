import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CopilotSeatsService {
  

  constructor(private http: HttpClient) { }
  
  getCopilotSeatsData(): Observable<any> {
    return new Observable(observer => {
      this.findSeatsFile().subscribe({
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

  findSeatsFile(): Observable<string> {
    return this.http.get('assets/data.txt', { responseType: 'text' }).pipe(
      map(data => {
        const lines = data.split('\n');
        for (let line of lines) {
          if (line.startsWith('copilot_seats') && line.endsWith('.json')) {
            console.log('Found file: ' + line);
            return line;
          }
        }
        return "";
      })
    );
  }
  
}
