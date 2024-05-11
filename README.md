# Copilot Dashboard
This GitHub repository provides an end-to-end solution for visualizing various Copilot metrics data sourced from APIs. Leveraging GitHub Actions, this solution integrates seamlessly with Copilot Usage and Metrics APIs to generate insightful data visualizations. The repository also utilizes GitHub Pages for hosting the Angular-based Copilot dashboard.

**Features:**
- Utilizes GitHub Actions for automated workflows.
- Generates Copilot Usage and Metrics API responses in JSON format.
- Automates the deployment of the Copilot dashboard to GitHub Pages.
- Persistently store Coilot Metrics API response data over time in a JSON file format.

## Execution Flow

![cp dashboard flow](https://github.com/ambilykk/copilot-dashboard/assets/10282550/111ff71b-9eef-4f1c-ab74-083acafd0273)

## Setup Video

[![Copilot Dashboard Setup Video](https://img.youtube.com/vi/-3cPBgp59v0/0.jpg)](https://www.youtube.com/watch?v=-3cPBgp59v0)


1. **Initial Setup:**
   - Create a new repository based on this template.
   - Generate a Personal Access Token (PAT) with appropriate scopes (Fine-grained token with `GitHub Copilot Business - Access: Read and write`).
   - Store the PAT token as a repository secret named `ORG_TOKEN`.
   - Create a repository variable named `org_name` to store the organization name.

2. **Trigger Workflow:**
   - Manually trigger the "Copilot Metrics & Seats API Process" workflow for the first time.
   - Schedule the workflow to run on a weekly basis for automated data updates. Currently, the workflow is scheduled to run every Friday at 10:00 AM UTC.

3. **Workflow Execution:**
   - The workflow retrieves Copilot Usage and Metrics API responses and exports them to JSON files.
   - Upon completion, it triggers another workflow to build and deploy the Angular-based Copilot dashboard.
   - Please wait for the "Build and deploy Copilot Dashboard into GitHub Pages". workflow to successfully complete before proceeding further. 

4. **Deployment:**
   - Configure GitHub Pages to deploy from the `gh-pages` branch for hosting the Copilot dashboard.
   ![gh Pages setup](https://github.com/ambilykk/copilot-dashboard/assets/10282550/63dbd5bc-6eb2-4852-a368-32eb0730d357)
    
   - After configuring the Pages setup, it automatically initiates a new Workflow titled "pages build and deployment". Please wait for this workflow to successfully complete before proceeding further.

5. **Navigation:**
   - Go to the "Code" tab of the repository and navigate to the "Deployment" section.
   - Select the GitHub Pages link under "Deployment".
     
     ![deployment 1](https://github.com/ambilykk/copilot-dashboard/assets/10282550/9fdeffe5-f834-401f-9ec7-a8393723a032)


   - The page URL will be available in the deployments page, allowing you to open the dashboard.
     ![gh deploy](https://github.com/ambilykk/copilot-dashboard/assets/10282550/c74c421f-b482-4592-9646-01b98e266bb0)


## Contributions & License

**Pending Tasks:**
- [ ] Current implementation of the Copilot Metrics API visualization won't be suitable for metrics for a longer duration like 6 months or 1 year. 
- [ ] Current implementation focus only on Organization level data. Implement the same for the Enterprise and Teams level.
- [ ] UI Styling and additional features like filtering based on date selection to enhance the dashboard.

**Contributions:**
Contributions and feedback are welcome! Feel free to fork this repository, make changes, and submit pull requests.

**License:**
This repository is licensed under the [MIT License](./LICENSE.md).
