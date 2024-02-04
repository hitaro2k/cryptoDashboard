import requests


def get_crypto_info(symbols):
    api_key = '47e4f21a0ca0f5834f9d60d1cbb648c4f46f7df0bdefa1b239daec57127f1695'
    symbols_str = ','.join(symbols)
    url = f'https://min-api.cryptocompare.com/data/pricemultifull?fsyms={symbols_str}&tsyms=USD&api_key={api_key}'

    try:
        response = requests.get(url)
        data = response.json()

        crypto_info_list = []

        for symbol in symbols:
            if 'RAW' in data and symbol in data['RAW']:
                crypto_info = data['RAW'][symbol]['USD']
                name = crypto_info['FROMSYMBOL']
                current_price = crypto_info['PRICE']
                price_change_24h = crypto_info['CHANGEPCT24HOUR']
                image_url = f'https://www.cryptocompare.com{crypto_info["IMAGEURL"]}'

                crypto_info_list.append({
                    'name': name,
                    'symbol': symbol,
                    'current_price': current_price,
                    'price_change_24h': price_change_24h,
                    'image_url': image_url
                })
            else:
                print(f"Invalid response structure or symbol not found: {symbol}")

        return crypto_info_list

    except requests.exceptions.RequestException as e:
        print(f"API request error: {e}")
        return None
