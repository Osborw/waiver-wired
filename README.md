## Waiver Wired
A React/JS app for collection and view of weekly fantasy football statistics to improve your waiver wire picks.

## Usage

### Setup
In root level of the project, create a .env file with the following

.env
```
SLEEPER_LEAGUE_ID=<sleeper-id> #18-digit id linked to sleeper league. This lets you see which players are taken or available
YEAR=2023 #Current season (latest 2023)
WEEK=2 #Latest week with stats (update this weekly)
```

### Read
This collects player statistics for the season to calculate PPR scoring and stores them locally to be used by the app.

```
mkdir files
cd read
npm i
npm run start
```

### Server
```
cd api
npm i
npm run start
```

### UI
```
cd view
npm i
npm run dev
```
Run the server and UI together to run the app.

By default the app runs on port 3000, so visit localhost:3000 to view locally.
