# OVR/UNDR - NBA Player Performance Tracker

A React-based web application that helps users make more informed betting decisions by tracking NBA player performance against betting lines. Search for any NBA player and visualize their recent game statistics with interactive charts and filtering options.

## Features

### 🏀 Player Statistics Dashboard
- Search for NBA players by name
- View comprehensive game-by-game performance history
- Interactive bar charts showing player stats vs. betting lines
- Color-coded visualization (green/red) indicating over/under performance

### 📊 Multiple Stat Categories
- **Individual Stats**: Points (PTS), Rebounds (TRB), Assists (AST), 3-Pointers (3P), Steals (STL), Blocks (BLK)
- **Combined Stats**: PTS+AST, PTS+REB, REB+AST, PTS+REB+AST, STL+BLK
- **Supporting Stats**: Minutes Played, Fouls, Field Goal Attempts, 3-Point Attempts, Free Throw Attempts

### 🔍 Advanced Filtering
- **Opponent Filter**: See performance against specific teams
- **Minutes Filter**: Filter games by minimum minutes played
- **Game Range**: View Last 5 (L5) or Last 10 (L10) games
- **Home/Away**: Filter by game location

### 📈 Interactive Charts
- Main performance chart with betting line overlay
- Supporting statistics chart
- Pagination through game history
- Responsive design for all screen sizes

## Tech Stack

### Frontend
- **React** - UI framework
- **React Router** - Client-side routing
- **Chart.js** with **react-chartjs-2** - Data visualization
- **Vite** - Build tool and development server
- **Sonner** - Toast notifications

### Backend
- **Node.js** with **Express** - REST API server
- **PostgreSQL** - Database for player statistics

### Development Tools
- **ESLint** - Code linting
- **CSS3** - Custom styling with animations

## Project Structure

```
src/
├── components/
│   ├── About.jsx
│   ├── Contact.jsx
│   ├── Error.jsx
│   ├── Footer.jsx
│   ├── Header.jsx
│   ├── LandingInfo.jsx
│   ├── LandingMain.jsx
│   ├── PlayerStats.jsx
│   └── Search.jsx
├── styles/
│   ├── header.css
│   ├── landingInfo.css
│   ├── landingMain.css
│   └── stats.css
├── assets/
│   └── [images and icons]
├── App.jsx
├── main.jsx
└── server.js
```

## Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd stat-finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the `src` directory with your database credentials:
   ```env
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=nba_data
   DB_PORT=5432
   VITE_API_URL=http://localhost:5000
   ```

4. **Database Setup**
   - Ensure PostgreSQL is installed and running
   - Import the provided CSV 'all_players_gamelog_2025.csv' into a `players` table within the database listed in your .env
   - 
## Database Schema

The application expects a PostgreSQL table named `players` with the following columns:

| Column | Type | Description |
|--------|------|-------------|
| `Rk` | integer | Rank/Game number |
| `Gcar` | integer | Games in career |
| `Gtm` | integer | Games this season |
| `Date` | text | Game date |
| `Team` | text | Player's team |
| `Home` | text | Home team indicator |
| `Opp` | text | Opponent team |
| `Result` | text | Game result (W/L) |
| `GS` | text | Game started indicator |
| `MP` | text | Minutes played |
| `FG` | integer | Field goals made |
| `FGA` | integer | Field goal attempts |
| `FG%` | real | Field goal percentage |
| `3P` | integer | 3-pointers made |
| `3PA` | integer | 3-point attempts |
| `3P%` | real | 3-point percentage |
| `2P` | integer | 2-pointers made |
| `2PA` | integer | 2-point attempts |
| `2P%` | real | 2-point percentage |
| `eFG%` | real | Effective field goal percentage |
| `FT` | integer | Free throws made |
| `FTA` | integer | Free throw attempts |
| `FT%` | real | Free throw percentage |
| `ORB` | integer | Offensive rebounds |
| `DRB` | integer | Defensive rebounds |
| `TRB` | integer | Total rebounds |
| `AST` | integer | Assists |
| `STL` | integer | Steals |
| `BLK` | integer | Blocks |
| `TOV` | integer | Turnovers |
| `PF` | integer | Personal fouls |
| `GmSc` | real | Game score |
| `PlusMin` | integer | Plus/minus |
| `pID` | text | Player ID |
| `Name` | text | Player name |

### Table Creation SQL

```sql
CREATE TABLE players (
    "Rk" INTEGER,
    "Gcar" INTEGER,
    "Gtm" INTEGER,
    "Date" TEXT,
    "Team" TEXT,
    "Home" TEXT,
    "Opp" TEXT,
    "Result" TEXT,
    "GS" TEXT,
    "MP" TEXT,
    "FG" INTEGER,
    "FGA" INTEGER,
    "FG%" REAL,
    "3P" INTEGER,
    "3PA" INTEGER,
    "3P%" REAL,
    "2P" INTEGER,
    "2PA" INTEGER,
    "2P%" REAL,
    "eFG%" REAL,
    "FT" INTEGER,
    "FTA" INTEGER,
    "FT%" REAL,
    "ORB" INTEGER,
    "DRB" INTEGER,
    "TRB" INTEGER,
    "AST" INTEGER,
    "STL" INTEGER,
    "BLK" INTEGER,
    "TOV" INTEGER,
    "PF" INTEGER,
    "GmSc" REAL,
    "PlusMin" INTEGER,
    "pID" TEXT,
    "Name" TEXT
);
```

**Note:** Column names are case-sensitive and must match exactly as shown above.

## Usage

### Development Mode
1. **Start the backend server**
   ```bash
   node src/server.js
   ```
   Server will run on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   npm run dev
   ```
   Application will be available at `http://localhost:5173`

### Production Build
```bash
npm run build
```

## API Endpoints

### GET `/api/player`
Retrieve player statistics with optional filtering.

**Query Parameters:**
- `name` (required) - Player name in "First_Last" format
- `minutes` (optional) - Minimum minutes played filter
- `opp` (optional) - Opponent team filter
- `home` (optional) - Home games only
- `away` (optional) - Away games only

**Example:**
```
GET /api/player?name=LeBron_James&minutes=30&opp=LAL
```

## Key Components

### PlayerStats
- Main dashboard component
- Handles chart rendering and data visualization
- Manages filtering and pagination logic

### LandingMain
- Landing page with feature highlights
- Player search functionality
- Marketing sections with images

### App
- Main application component
- Routing configuration
- Global search handler

## Features in Detail

### Betting Line Analysis
The application shows how players perform relative to betting lines:
- **Green bars**: Performance exceeded the line
- **Red bars**: Performance was below the line
- **Gray bars**: Performance matched the line exactly

### Data Visualization
- Clean, interactive graphs that make trends easy to spot
- No need to analyze raw spreadsheet data
- Quick insights for fantasy, betting, or general basketball research

### Smart Filtering
- Filter by opponent to see matchup-specific performance
- Minutes filter to focus on games with significant playing time
- Home/away splits for location-based analysis

## Data Sources
- Player statistics sourced from Basketball-Reference.com
- Player headshots and team logos from official sources
- Real-time data filtering through PostgreSQL queries

This project uses data from Basketball-Reference.com.

---

**Note**: This application is designed for educational and research purposes. Always gamble responsibly and within your means.
