import requests
from bs4 import BeautifulSoup
import pandas as pd
import time

def scrape_player_gamelog(player_id, year=2025):
    time.sleep(5)

    """
    Scrapes basketball player game log data from Basketball Reference
    
    Args:
        player_id (str): Player ID (e.g., 'barnesc01')
        year (int): Season year (e.g., 2025)
    
    Returns:
        tuple: (DataFrame, player_id) or (None, player_id) if failed
    """
    
    # Construct URL
    url = f"https://www.basketball-reference.com/players/{player_id[0]}/{player_id}/gamelog/{year}"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        print(f"Scraping {player_id} for {year} season...")
        
        # Send GET request
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raises an HTTPError for bad responses
        
        # Parse HTML content
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Find the game log table
        table = soup.find('table', {'class': 'stats_table'})
        
        if not table:
            print(f"Game log table not found for {player_id}. The page structure may have changed.")
            return None, player_id
        
        # Extract table headers
        headers_row = table.find('thead').find('tr')
        headers = [th.get_text().strip() for th in headers_row.find_all('th')]
        
        # Extract table data
        tbody = table.find('tbody')
        rows = tbody.find_all('tr')
        
        data = []
        for row in rows:
            # Skip rows that are just headers (class="thead")
            if 'thead' in row.get('class', []):
                continue
                
            cells = row.find_all(['td', 'th'])
            row_data = [cell.get_text().strip() for cell in cells]
            
            # Only add rows with data
            if row_data and any(cell for cell in row_data):
                data.append(row_data)
        
        # Create DataFrame
        df = pd.DataFrame(data, columns=headers)
        
        # Clean up the data
        df = df.dropna(how='all') 
        
        # Add player ID column for identification
        df['player_id'] = player_id
        
        print(f"Successfully scraped {len(df)} games for {player_id}")
        return df, player_id
        
    except requests.exceptions.RequestException as e:
        print(f"Error fetching the page for {player_id}: {e}")
        return None, player_id
    except Exception as e:
        print(f"Error parsing the page for {player_id}: {e}")
        return None, player_id

def scrape_multiple_players(player_ids, year=2025, delay=5):
    """
    Scrapes game logs for multiple players
    
    Args:
        player_ids (list): List of player IDs
        year (int): Season year
        delay (int): Delay between requests in seconds
    
    Returns:
        dict: Dictionary with player_id as key and DataFrame as value
    """
    
    all_data = {}
    failed_players = []
    
    for i, player_id in enumerate(player_ids):
        print(f"\nProcessing player {i+1}/{len(player_ids)}: {player_id}")
        
        # Scrape player data
        df, pid = scrape_player_gamelog(player_id, year)
        
        if df is not None:
            all_data[pid] = df
            
            # Save individual player data
            filename = f'{pid}_gamelog_{year}.csv'
            df.to_csv(filename, index=False)
            print(f"Data saved to '{filename}'")
            
        else:
            failed_players.append(pid)
            print(f"Failed to scrape data for {pid}")
        
        # Add delay between requests 
        if i < len(player_ids) - 1: 
            print(f"Waiting {delay} seconds before next request...")
            time.sleep(delay)
    
    if failed_players:
        print(f"Failed players: {failed_players}")
    
    return all_data, failed_players

def combine_all_data(all_data, year=2025):
    """
    Combines all player data into a single DataFrame
    
    Args:
        all_data (dict): Dictionary of player DataFrames
        year (int): Season year
    
    Returns:
        DataFrame: Combined DataFrame with all players
    """
    
    if not all_data:
        print("No data to combine.")
        return None
    
    # Combine all DataFrames
    combined_df = pd.concat(all_data.values(), ignore_index=True)
    
    # Save combined data
    combined_filename = f'all_players_gamelog_{year}.csv'
    combined_df.to_csv(combined_filename, index=False)
    
    print(f"\nCombined data saved to '{combined_filename}'")
    print(f"Total games across all players: {len(combined_df)}")
    
    return combined_df

def main():
    # List of player IDs to scrape
    player_ids = [
        'barnesc01',
        'tatumja01', 
        'doncilu01', 
        'antetgi01', 
        'jokicni01', 
        'curryst01', 
        'duranke01', 
        'jamesle01', 
        'davisan02', 
        'lillada01',  
    ]

    
    year = 2025
    delay_between_requests = 5
    
    print("Starting multi-player scraping...")
    print(f"Players to scrape: {player_ids}")
    print(f"Season: {year}")
    print(f"Delay between requests: {delay_between_requests} seconds")
    
    # Scrape all players
    all_data, failed_players = scrape_multiple_players(
        player_ids, 
        year=year, 
        delay=delay_between_requests
    )
    
    # Combine all data into one file
    if all_data:
        combined_df = combine_all_data(all_data, year)
        
        if combined_df is not None:
            print(f"\nFirst few rows of combined data:")
            print(combined_df.head())
            
            print(f"\nColumns: {list(combined_df.columns)}")
            print(f"Combined data shape: {combined_df.shape}")
            
            # Show data per player
            print(f"\nGames per player:")
            player_counts = combined_df['player_id'].value_counts()
            for player, count in player_counts.items():
                print(f"  {player}: {count} games")
    
    print("\nScraping completed!")

if __name__ == "__main__":
    main()