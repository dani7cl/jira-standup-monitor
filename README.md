# Jira Standup Monitor <img src="ramondly.png" alt="logo" width="70"/>

Ramondly decides who's next on standups

<img src="images/usage.gif" alt="usage" width="600"/>

## Installation
- Clone the repository
- Go to chrome://extensions/
- Toggle on the "Developer mode" switch on the top right menu
- Click on the "Load unpacked" button on the top left and choose the folder of the cloned repository
- (Optional) Pin the extension for easy access

That's it, you are ready to use it :)

## User Guide Jira Standup Monitor
 - Go to https://dev-jira.dynatrace.org/secure/RapidBoard.jspa
 - Check all the team members are on a quick filter label
 - Open the extension.
 - Click "Show player" to display the player on top of the JIRA board.
 - A player with the functions (postpone, previous, start/show results, next, skip) will appear
 - At any moment, you can click on "Clear data" to reset everything so you can start again.

<img src="images/highlights.png" alt="highlights" height="400"/>

## User Guide Sprint Data Extractor
 - Genereate a token on the Token Viewer section of the Debug UI on demo.dev
 - Open your terminal(mac, linux or git bash) and set your token variable that will be used later.
   - `export DEMO_DEV_TOKEN=WhateverValidTokenHash`
 - Go to the https://dev-jira.dynatrace.org Backlog.
 - Verify there is no filter applied(name, team, etc).
 - Identify the title of the sprint you want to extract the data, such as Dynatrace Sprint 243.
 - Open the extension and click on Sprint Data Extractor
  <p align="center">
     <img src="images/sprint-data-extractor.png" alt="sprint-data-extractor" width="150"/>
  </p>
  
 - Select the sprint you want on the dropdown
 - Now let's focus on the two main functions:
   - Copy Dashboard HTTP Post => Clicking on this button copies a curl command to generate the data of the dashboard, you just need to paste it to the same terminal you set your DEMO_DEV_TOKEN variable and the Dashboard will be created
     - Afterwards, you can go to the Dashboards list of Demo Dev and find the Dashboard with the name you got on the output of the command. Dashboard will look similar to this one
    <img src="images/dashboard-without-data.png" alt="dashboard-without-data" width="400"/>
    Now you need to fill the data of the pie chart visualization
   - Copy Metric HTTP Post => Clicking on this button copies a curl command to generate the data of the pie chart of your dashboard, you just need to paste it to the same terminal you set your DEMO_DEV_TOKEN variable
  <p align="center">
      <img src="images/pie.png" alt="pie-chart" width="150"/>
  </p>

That's it! You have the base of your Dashboard (Title, Tags, Pie, Summary, Backports to PROD, Researches, Features divided by epic and links to the JIRA and the sprints). Now you can iterate over it if you want to make it prettier :)


## CHANGELOG
See changes [here](CHANGELOG.md)
