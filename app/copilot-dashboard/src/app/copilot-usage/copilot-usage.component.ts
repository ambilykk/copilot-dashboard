import { Component, OnInit } from '@angular/core';
import { CopilotMetricsService } from '../services/copilot-metrics.service';
import Chart from 'chart.js/auto';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-copilot-usage',
  templateUrl: './copilot-usage.component.html',
  styleUrl: './copilot-usage.component.scss'
})
export class CopilotUsageComponent {


  orgName: any = "";
  data: any = [];
  public chart: any;
  public userChart: any;
  public langChart: any;
  public langUserChart: any;
  public editorChart: any;
  public editorUserChart: any;
  xlabel: any = [];
  total_lines_suggested: any = [];
  total_lines_accepted: any = [];
  total_active_users: any = [];

  xChatLabel: any = [];
  total_chat_turns: any = [];
  total_chat_acceptances: any = [];
  total_active_chat_users: any = [];

  dateSelected: any = "";
  langTitle: any = "";
  editorTitle: any = "";
  pieChartTitle: any = "";

  cards: any;

  constructor(private copilotMetricsService: CopilotMetricsService) { }

  ngOnInit(): void {
    //this.orgName = environment.orgName;
    // create chart
    this.getData();
  }

  getData() {

    // get orgname
    this.copilotMetricsService.extractOrgName().subscribe((data: any) => {
      this.orgName = data;
    });

    // get data from service
    this.copilotMetricsService.getCopilotMetricsData().subscribe((data: any) => {
      // console.log(data);
      this.data = data;
      sessionStorage.setItem('orgData', JSON.stringify(data));
      this.chartDataInitialization();
    });
  }

  chartDataInitialization() {
    var avgActiveUsers = 0;
    var totalSuggestions = 0;
    var totalAccepted = 0;
    var count = 0;

    // extract the data from the JSON
    this.data.forEach((element: any) => {
      // Format date from 2025-03-24 to Mar 24
      const dateObj = new Date(element.date);
      const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      this.xlabel.push(formattedDate);
      
      // Get data from copilot_ide_code_completions which contains the code completions data
      let totalLinesSuggested = 0;
      let totalLinesAccepted = 0;
      
      // If the element has IDE code completions data with editors
      if (element.copilot_ide_code_completions && 
          element.copilot_ide_code_completions.editors) {
        
        // Loop through each editor
        element.copilot_ide_code_completions.editors.forEach((editor: any) => {
          // Check if editor has models
          if (editor.models) {
            // Loop through each model
            editor.models.forEach((model: any) => {
              // Check if model has languages
              if (model.languages) {
                // Loop through each language
                model.languages.forEach((language: any) => {
                  // Add lines suggested and accepted
                  if (language.total_code_lines_suggested) {
                    totalLinesSuggested += language.total_code_lines_suggested;
                  }
                  if (language.total_code_lines_accepted) {
                    totalLinesAccepted += language.total_code_lines_accepted;
                  }
                });
              }
            });
          }
        });
      }
      
      this.total_lines_suggested.push(totalLinesSuggested);
      this.total_lines_accepted.push(totalLinesAccepted);
      this.total_active_users.push(element.total_active_users);

      count += 1;
      avgActiveUsers += element.total_active_users;
      
      // Calculate total suggestions and acceptances if possible
      if (element.copilot_ide_code_completions && 
          element.copilot_ide_code_completions.editors) {
        
        element.copilot_ide_code_completions.editors.forEach((editor: any) => {
          if (editor.models) {
            editor.models.forEach((model: any) => {
              if (model.languages) {
                model.languages.forEach((language: any) => {
                  if (language.total_code_suggestions) {
                    totalSuggestions += language.total_code_suggestions;
                  }
                  if (language.total_code_acceptances) {
                    totalAccepted += language.total_code_acceptances;
                  }
                });
              }
            });
          }
        });
      }
    });

    this.cards = [
      { title: 'Average Active Users', subtitle: Math.round(avgActiveUsers / count), content: 'Average number of Active Users' },
      { title: 'Total Suggestions', subtitle: totalSuggestions, content: 'The total number of suggestions offered by Copilot for all developers' },
      { title: 'Total Acceptance', subtitle: totalAccepted, content: 'The total number of suggestions accepted by users' },
      { title: 'Acceptance Rate', subtitle: Number((totalAccepted / totalSuggestions * 100).toFixed(2)) + "%", content: 'Percentage of suggestions that were accepted by users' }
    ];

    this.createChart();
  }

  createChart() {

    // If a chart already exists, destroy it
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart("org-summary-chart", {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: this.xlabel,
        datasets: [
          {
            label: "Lines Suggested",
            data: this.total_lines_suggested
          },
          {
            label: "Lines Accepted",
            data: this.total_lines_accepted
          }
        ]
      },
      options: {
        aspectRatio: 2.5,
        onClick: this.handleClick
      }

    });

    // If a chart already exists, destroy it
    if (this.userChart) {
      this.userChart.destroy();
    }

    this.userChart = new Chart("org-users-chart", {
      type: 'line',

      data: {
        labels: this.xlabel,
        datasets: [
          {
            label: "Active Users",
            data: this.total_active_users
          }
        ]
      }
    });


  }

  handleClick = (evt: any): void => {
    var points = evt.chart.getElementsAtEventForMode(evt, 'nearest', {
      intersect: true
    }, true);
    if (points.length) {
      const firstPoint = points[0];
      const label = evt.chart.data.labels[firstPoint.index];
      this.dateSelected = "Selected Date: " + label;

      // find the data for the selected label
      var orgData = JSON.parse(sessionStorage.getItem('orgData') || '{}');
      
      // Find the clicked date data
      const clickedDateIndex = this.xlabel.indexOf(label);
      if (clickedDateIndex === -1 || !orgData[clickedDateIndex]) {
        return;
      }
      
      const selectedDateData = orgData[clickedDateIndex];
      
      // Initialize the arrays for language and editor data
      var xLangLabel: any = [];
      var lang_lines_suggested: any = [];
      var lang_lines_accepted: any = [];
      var lang_active_users: any = [];

      var xEditorLabel: any = [];
      var editor_lines_suggested: any = [];
      var editor_lines_accepted: any = [];
      var editor_active_users: any = [];

      // Extract language data from the clicked date
      if (selectedDateData.copilot_ide_code_completions && 
          selectedDateData.copilot_ide_code_completions.languages) {
            
        selectedDateData.copilot_ide_code_completions.languages.forEach((lang: any) => {
          if (lang.name) {
            xLangLabel.push(lang.name);
            // Add values if available, otherwise add 0
            lang_lines_suggested.push(0); // Default value if not available
            lang_lines_accepted.push(0); // Default value if not available 
            lang_active_users.push(lang.total_engaged_users || 0);
          }
        });
      }
      // If languages are nested under editors and models
      else if (selectedDateData.copilot_ide_code_completions && 
              selectedDateData.copilot_ide_code_completions.editors) {
        // Create a map to aggregate language data
        const langMap = new Map();
                
        // Loop through editors
        selectedDateData.copilot_ide_code_completions.editors.forEach((editor: any) => {
          if (editor.models) {
            // Loop through models
            editor.models.forEach((model: any) => {
              if (model.languages) {
                // Loop through languages
                model.languages.forEach((lang: any) => {
                  if (lang.name) {
                    // If language already exists in map, update values
                    if (langMap.has(lang.name)) {
                      const existing = langMap.get(lang.name);
                      langMap.set(lang.name, {
                        total_engaged_users: (existing.total_engaged_users || 0) + (lang.total_engaged_users || 0),
                        total_code_lines_suggested: (existing.total_code_lines_suggested || 0) + (lang.total_code_lines_suggested || 0),
                        total_code_lines_accepted: (existing.total_code_lines_accepted || 0) + (lang.total_code_lines_accepted || 0)
                      });
                    } else {
                      // Add new language to map
                      langMap.set(lang.name, {
                        total_engaged_users: lang.total_engaged_users || 0,
                        total_code_lines_suggested: lang.total_code_lines_suggested || 0,
                        total_code_lines_accepted: lang.total_code_lines_accepted || 0
                      });
                    }
                  }
                });
              }
            });
          }
        });
        
        // Convert map to arrays for the chart
        langMap.forEach((value, key) => {
          xLangLabel.push(key);
          lang_lines_suggested.push(value.total_code_lines_suggested);
          lang_lines_accepted.push(value.total_code_lines_accepted);
          lang_active_users.push(value.total_engaged_users);
        });
      }

      // Extract editor data
      if (selectedDateData.copilot_ide_code_completions && 
          selectedDateData.copilot_ide_code_completions.editors) {
        
        const editorMap = new Map();
        
        selectedDateData.copilot_ide_code_completions.editors.forEach((editor: any) => {
          if (editor.name) {
            let totalLinesSuggested = 0;
            let totalLinesAccepted = 0;
            
            // Go through models if available
            if (editor.models) {
              editor.models.forEach((model: any) => {
                if (model.languages) {
                  model.languages.forEach((lang: any) => {
                    totalLinesSuggested += (lang.total_code_lines_suggested || 0);
                    totalLinesAccepted += (lang.total_code_lines_accepted || 0);
                  });
                }
              });
            }
            
            // If editor already exists in map, update values
            if (editorMap.has(editor.name)) {
              const existing = editorMap.get(editor.name);
              editorMap.set(editor.name, {
                total_engaged_users: (existing.total_engaged_users || 0) + (editor.total_engaged_users || 0),
                total_lines_suggested: existing.total_lines_suggested + totalLinesSuggested,
                total_lines_accepted: existing.total_lines_accepted + totalLinesAccepted
              });
            } else {
              // Add new editor to map
              editorMap.set(editor.name, {
                total_engaged_users: editor.total_engaged_users || 0,
                total_lines_suggested: totalLinesSuggested,
                total_lines_accepted: totalLinesAccepted
              });
            }
          }
        });
        
        // Convert map to arrays for the chart
        editorMap.forEach((value, key) => {
          xEditorLabel.push(key);
          editor_lines_suggested.push(value.total_lines_suggested);
          editor_lines_accepted.push(value.total_lines_accepted);
          editor_active_users.push(value.total_engaged_users);
        });
      }

      // chart for language breakdown
      this.languageChart(xLangLabel, lang_lines_suggested, lang_lines_accepted);

      // chart for editor breakdown
      this.editorDetChart(xEditorLabel, editor_lines_suggested, editor_lines_accepted);
    }
  }

  languageChart(xLangLabel: any, lang_lines_suggested: any, lang_lines_accepted: any): void {

    this.langTitle = " Language: Number of Lines Suggested vs Accepted";
    if (this.langChart) { this.langChart.destroy(); }
    this.langChart = new Chart("lang-chart", {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: xLangLabel,
        datasets: [
          {
            label: "Lines Suggested",
            data: lang_lines_suggested
          },
          {
            label: "Lines Accepted",
            data: lang_lines_accepted
          }
        ]
      },
      options: {
        aspectRatio: 2.5
      }

    });
  }

  editorDetChart(xEditorLabel: any, editor_lines_suggested: any, editor_lines_accepted: any): void {

    this.editorTitle = "Editor: Number of Lines Suggested vs Accepted";
    // add stacked bar chart using xEditorLabel, total_lines_suggested and total_lines_accepted
    if (this.editorChart) { this.editorChart.destroy(); }
    this.editorChart = new Chart("editor-chart", {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: xEditorLabel,
        datasets: [
          {
            label: "Lines Suggested",
            data: editor_lines_suggested
          },
          {
            label: "Lines Accepted",
            data: editor_lines_accepted
          }
        ]
      },
      options: {
        aspectRatio: 2.5
      }

    });
  }

  langAndEditorUserChart(xLangLabel: any, lang_active_users: any, xEditorLabel: any, editor_active_users: any): void {

    this.pieChartTitle = "Active Users: Language & Editor";
    // add a pie chart using xLangLabel and total_active_users
    if (this.langUserChart) { this.langUserChart.destroy(); }
    this.langUserChart = new Chart("lang-pie-chart", {
      type: 'pie', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: xLangLabel,
        datasets: [
          {
            label: "Active Users",
            data: lang_active_users
          }
        ]
      }
    });

    // add a pie chart using xEditorLabel and total_active_users
    if (this.editorUserChart) { this.editorUserChart.destroy(); }
    this.editorUserChart = new Chart("editor-pie-chart", {
      type: 'pie', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: xEditorLabel,
        datasets: [
          {
            label: "Active Users",
            data: editor_active_users
          }
        ]
      },
      options: {
        aspectRatio: 2.5,
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true
          }
        }
      }

    });
  }

  onTabClick = (evt: MatTabChangeEvent): void => {
    
    if (evt.index === 0){
      this.createChart();
    }
    else if (evt.index === 1) {
      var orgData = JSON.parse(sessionStorage.getItem('orgData') || '{}');
      this.xChatLabel = [];
      this.total_chat_turns = [];
      this.total_chat_acceptances = [];
      this.total_active_chat_users = [];

      orgData.forEach((element: any) => {
        // Format date from 2025-03-24 to Mar 24
        const dateObj = new Date(element.date);
        const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        this.xChatLabel.push(formattedDate);
        
        // Get chat metrics
        let totalChatTurns = 0;
        let totalChatCopy = 0;
        let totalChatInsertions = 0;
        
        // Check for IDE chat
        if (element.copilot_ide_chat && element.copilot_ide_chat.editors) {
          element.copilot_ide_chat.editors.forEach((editor: any) => {
            if (editor.models) {
              editor.models.forEach((model: any) => {
                totalChatTurns += (model.total_chats || 0);
                totalChatCopy += (model.total_chat_copy_events || 0);
                totalChatInsertions += (model.total_chat_insertion_events || 0);
              });
            }
          });
        }
        
        // Check for dotcom chat
        if (element.copilot_dotcom_chat && element.copilot_dotcom_chat.models) {
          element.copilot_dotcom_chat.models.forEach((model: any) => {
            totalChatTurns += (model.total_chats || 0);
          });
        }
        
        this.total_chat_turns.push(totalChatTurns);
        // Sum of copy and insertion events as chat acceptances
        this.total_chat_acceptances.push(totalChatCopy + totalChatInsertions);
        
        // Get active chat users (engaged users)
        let activeChatUsers = 0;
        if (element.copilot_ide_chat) {
          activeChatUsers += (element.copilot_ide_chat.total_engaged_users || 0);
        }
        if (element.copilot_dotcom_chat) {
          activeChatUsers += (element.copilot_dotcom_chat.total_engaged_users || 0);
        }
        
        this.total_active_chat_users.push(activeChatUsers);
      });

      // If a chart already exists, destroy it
      if (this.chart) {
        this.chart.destroy();
      }

      // Chat Metrics plotting
      this.chart = new Chart("chat-chart", {
        type: 'bar', //this denotes the type of chart

        data: {// values on X-Axis
          labels: this.xChatLabel,
          datasets: [
            {
              label: "Chat Turns",
              data: this.total_chat_turns
            },
            {
              label: "Chat Acceptance",
              data: this.total_chat_acceptances
            }
          ]
        },
        options: {
          aspectRatio: 2.5,
        }

      });

      // If a chart already exists, destroy it
      if (this.userChart) {
        this.userChart.destroy();
      }

      this.userChart = new Chart("chat-users-chart", {
        type: 'line',

        data: {
          labels: this.xChatLabel,
          datasets: [
            {
              label: "Active Chat Users",
              data: this.total_active_chat_users
            }
          ]
        }
      });
    }
  }

}
