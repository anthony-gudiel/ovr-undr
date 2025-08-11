import requests
from bs4 import BeautifulSoup
import pandas as pd
import time

def scrape_player_gamelog(player_id, year=2025):
    time.sleep(10)

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
        response = requests.get(url, headers=headers, timeout=30)
        
        # Check for rate limiting
        if response.status_code == 429:
            print(f"Rate limited! Waiting 10 minutes before retrying {player_id}...")
            time.sleep(600)  # Wait 10 minutes
            response = requests.get(url, headers=headers, timeout=30)
        
        response.raise_for_status()
        
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

def scrape_multiple_players(player_ids, year=2025, delay=10):
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

def append_to_csv(all_data, year=2025, filename=None):
    """
    Appends new player data to existing CSV file
    
    Args:
        all_data (dict): Dictionary of player DataFrames
        year (int): Season year
        filename (str): Optional custom filename
    
    Returns:
        DataFrame: Combined DataFrame with new players
    """
    
    if not all_data:
        print("No data to append.")
        return None
    
    # Combine all DataFrames
    combined_df = pd.concat(all_data.values(), ignore_index=True)
    
    # Define filename
    if filename is None:
        filename = f'all_players_gamelog_{year}.csv'
    
    # Check if file exists
    import os
    if os.path.exists(filename):
        # Append to existing file
        combined_df.to_csv(filename, mode='a', header=False, index=False)
        print(f"\nAppended {len(combined_df)} games to existing '{filename}'")
    else:
        # Create new file
        combined_df.to_csv(filename, index=False)
        print(f"\nCreated new file '{filename}' with {len(combined_df)} games")
    
    return combined_df

def main():
    # List of player IDs to scrape
    player_ids = [
        # Raptors
        'barnesc01','barrerj01','poeltja01', 'quickim01', 'ingrabr01', 'dickgr01', 'sheadja01', 'walteja01', 'agbajoc01', 'mogbojo01', 'murraco01',
        # Hawks
        'youngtr01', 'daniedy01', 'porzikr01', 'okongon01', 'johnsja05', 'alexani01', 'risacza01',
        # Celtics
        'tatumja01', 'brownja02', 'pritcpa01', 'whitede01', 'simonan01', 'hausesa01', 'quetane01',
        # Nets
        'portemi01', 'claxtni01', 'johnske07', 'mannte01', 'wilsoja03',
        # Hornets
        'ballla01', 'millebr02', 'willigr01', 'bridgmi02', 'greenjo02', 'plumlma01', 'salauti01',
        # Bulls
        'willipa01', 'jonestr01', 'okorois01', 'smithja04', 'huertke01', 'buzelma01', 'dosunay01', 'vucevni01', 'whiteco01',
        # Cavs
        'allenja01', 'garlada01', 'huntede01', 'mitchdo01', 'balllo01', 'mobleev01', 'wadede01',
        # Mavs
        'chrisma02', 'russeda01', 'irvinky01', 'washipj01', 'davisan02', 'livelde01', 'thompkl01', 'gaffoda01',
        # Nuggets
        'hardati02', 'jokicni01', 'braunch01', 'gordoaa01', 'westbru01', 'brownbr01', 'murraja01',
        # Pistons
        'iveyja01', 'durenja01', 'thompau01', 'stewais01', 'harrito02', 'cunnica01', 'leverca01',
        # Warriors
        'curryst01', 'butleji01', 'podzibr01', 'greendr01', 'hieldbu01', 'moodymo01', 'postqu01',
        # Rockets
        'capelca01', 'okogijo01', 'finnedo01', 'duranke01', 'vanvlfr01', 'thompam01', 'smithja05', 'sengual01', 'adamsst01',
        # Pacers
        'siakapa01', 'halibty01', 'nesmiaa01', 'mathube01', 'nembhan01', 'mccontj01', 'sheppbe01', 'walkeja02',
        # Clippers
        'paulch01', 'bealbr01', 'hardeja01', 'batumni01', 'lopezbr01', 'collijo01', 'zubaciv01', 'leonaka01',
        # Lakers
        'hayesja02', 'smartma01', 'aytonde01', 'doncilu01', 'jamesle01', 'knechda01', 'reaveau01', 'hachiru01',
        # Grizzlies
        'caldwke01', 'aldamsa01', 'pippesc02', 'jacksja02', 'edeyza01', 'wellsja01', 'konchjo01', 'moranja01', 'clarkbr01', 'jacksgg01',
        # Heat
        'adebaba01', 'powelno01', 'roziete01', 'jovicni01', 'herroty01', 'wiggian01', 'jaqueja01', 'wareke01', 'highsha01', 'mitchda01',
        # Bucks
        'trentga02', 'anthoco01', 'princta02', 'harriga01', 'kuzmaky01', 'portibo01', 'turnemy01', 'porteke02', 'antetgi01', 'greenaj01',
        # Timberwolves
        'edwaran01', 'divindo01', 'mcdanja02', 'conlemi01', 'goberru01', 'reidna01', 'randlju01',
        # Pelicans
        'looneke01', 'paytoel01', 'willizi01', 'murphtr02', 'alvarjo01', 'beysa01', 'missiyv01', 'murrade01', 'joneshe01', 'poolejo01',
        # Knicks
        'bridgmi01', 'townska01', 'robinmi01', 'hartjo01', 'mcbrimi01', 'anunoog01', 'brunsja01', 'clarkjo01',
        # Thunder
        'willija07', 'carusal01', 'wiggiaa01', 'harteis01', 'gilgesh01', 'joeis01', 'wallaca01', 'dortlu01', 'holmgch01', 'willija06',
        # Magic
        'isaacjo01', 'wagnemo01', 'jonesty01', 'suggsja01', 'dasiltr01', 'cartewe01', 'wagnefr01', 'banede01', 'blackan01', 'banchpa01',
        # 76ers
        'lowryky01', 'walkeja01', 'edgecvj01', 'embiijo01', 'gordoer01', 'georgpa01', 'drumman01', 'oubreke01', 'maxeyty01', 'mccaija01',
        # Suns
        'willima07', 'greenja05', 'onealro01', 'allengr01', 'brookdi01', 'richani01', 'bookede01',
        # Blazers
        'avdijde01', 'lillada01', 'yangha01', 'clingdo01', 'holidjr01', 'williro04', 'grantje01', 'camarto01', 'murrakr01', 'hendesc01', 'sharpsh01',
        # Kings
        'schrode01', 'eubandr01', 'murrake02', 'derozde01', 'monkma01', 'elliske01', 'sabondo01', 'lavinza01',
        # Spurs
        'foxde01', 'sochaje01', 'johnske04', 'wembavi01', 'barneha02', 'champju02', 'vassede01', 'olynyke01', 'castlst01', 'harpedy01',
        # Jazz
        'loveke01', 'baileac01', 'filipky01', 'markkla01', 'kesslwa01', 'anderky01', 'colliis01', 'sensabr01', 'georgke01', 'sextoco01',
        # Wizards
        'mccolcj01', 'branhma01', 'whitmca01', 'coulibi01', 'middlkh01', 'carrica01', 'georgky01', 'sarral01', 'kispeco01', 'champju01'
    ]


    
    year = 2025
    delay_between_requests = 25
    batch_size = 10
    batch_delay = 300
    
    total_players = len(player_ids)
    total_batches = (total_players + batch_size - 1) // batch_size
    
    print("Starting batched multi-player scraping...")
    print(f"Total players to scrape: {total_players}")
    print(f"Season: {year}")
    print(f"Batch size: {batch_size}")
    print(f"Total batches: {total_batches}")
    print(f"Delay between requests: {delay_between_requests} seconds")
    print(f"Delay between batches: {batch_delay} seconds")
    
    all_failed_players = []
    total_scraped = 0
    
    for batch_num in range(total_batches):
        batch_start = batch_num * batch_size
        batch_end = min(batch_start + batch_size, total_players)
        batch_players = player_ids[batch_start:batch_end]
        
        print(f"\n{'='*60}")
        print(f"BATCH {batch_num + 1}/{total_batches}")
        print(f"Processing players {batch_start + 1}-{batch_end} of {total_players}")
        print(f"Players in this batch: {batch_players}")
        print(f"{'='*60}")
        
        # Scrape current batch
        batch_data, batch_failed = scrape_multiple_players(
            batch_players, 
            year=year, 
            delay=delay_between_requests
        )
        
        # Save batch data immediately
        if batch_data:
            append_to_csv(batch_data, year)
            total_scraped += len(batch_data)
            print(f"Batch {batch_num + 1} completed: {len(batch_data)} players scraped successfully")
        else:
            print(f"Batch {batch_num + 1} completed: No data scraped")
        
        # Track failed players
        if batch_failed:
            all_failed_players.extend(batch_failed)
            print(f"Failed players in batch {batch_num + 1}: {batch_failed}")
        
        # Delay between batches (except for the last batch)
        if batch_end < total_players:
            print(f"\nWaiting {batch_delay} seconds before next batch...")
            time.sleep(batch_delay)

        print(f"\n{'='*60}")
        print("SCRAPING COMPLETED!")
        print(f"{'='*60}")
        print(f"Total players processed: {total_players}")
        print(f"Successfully scraped: {total_scraped}")
        print(f"Failed players: {len(all_failed_players)}")
    
        if all_failed_players:
            print(f"List of failed players: {all_failed_players}")

if __name__ == "__main__":
    main()