## Waiver Wired
A React/TS app for collection and view of weekly fantasy football statistics to improve your waiver wire picks.

### View Players and their Season Trends
<img src="https://github.com/Osborw/waiver-wired/assets/32249906/c993d0bd-ce65-47fe-bc91-4a9ec714ff4a" width="800">

### Graphical View to Compare Scores
<img src="https://github.com/Osborw/waiver-wired/assets/32249906/dd2ee802-b8cb-4537-a645-49f452c84cd9" width="800">

## Usage

### Setup
In root level of the project, create a .env file with the following

.env
```
YEAR=2024 #Required - Current season (latest 2024)
WEEK=2 #Required - Latest week with stats (update this weekly)
```

### Read
This collects player statistics for the season to calculate PPR scoring and stores them locally to be used by the app.

```
cd server 
npm i
npm run start-read
```

### API
```
cd server 
npm i
npm run start-api 
```

### UI
```
cd view
npm i
npm run dev
```
Run the server and UI together to run the app.

By default the app runs on port 3000, so visit localhost:3000 to view locally.

To view your specific league, visit localhost:3000/leagueId/userId. These values can both be found within the Sleeper App settings.
