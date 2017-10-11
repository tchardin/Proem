## Links

- http://flask.pocoo.org for flask documentation
- https://docs.bitfinex.com/v2/reference for bitfinex API documentation.
- http://docs.celeryproject.org/en/latest/ for documentation on celery, the distributed task queue used to automate database maintenance.
- https://cryptowat.ch for all things crypto !


---

## Set up

This little project uses Flask, a lightweight python server.

If you haven't already, install python2.7.13 (the latest stable python2
version). An easy way of managing python versions is using pyenv:

```
$ brew install pyenv
$ pyenv install 2.7.13
```

Take note of the install location for this new python version.

For managing dependencies for a python project, you need `virtualenv` (like
`rbenv`, but for python):

```
$ pip install virtualenv
```

Each developer creates their own virtualenv for a given python project. In the
project folder:

```
$ virtualenv -p /path/to/your/new/python/bin/python venv
```

The folder `venv` will now contain all python dependencies for this project
only. This is local to each developer and is not committed; developers just
recreate their working environment by installing the defined dependencies. To
install those dependencies, first activate your newly created virtualenv (this
is something you need to manually do every time you enter the project
directory):

```
$ source bin/activate
```

And now install all requirements defined in requirements.text:

```
pip install -r requirements.txt
```

That's done with the environment set up. To run our api cd into the API directory and run :
```
./run_api.sh
```
API calls can now be made to `http://0.0.0.0:8080/`.

## Database Maintenance
 To automate the maintenance of the database of daily historical data and a local cache of minute precision values run:
```
./automate_script.sh
```
To update the RDS database using csv files, run:

```
python create_db.py
```

## API Endpoints

There are currently four endpoints for the API.

1. '/<string:coin>' which collects historical data for a coin. The coin argument is passed as the ticker symbol capitalised: eg: 'BTC'.
2. '/<string:coin>/<string:date_from>/<string:date_to>' searches the locally hosted database between two date strings passed in the format 'YYYY-MM-DD'.
3. '/now/<string:coin>' queries the bitfinex API for the most recent data point.
4. '/candles/<string:coin>/<string:interval>' queries the bitfinex API for candle milestones for plotting, the query automatically demands for the highest resolution possible. Possible resolutions are: '1m', '5m', '15m', '30m', '1h', '3h', '6h', '12h', '1D', '7D', '14D', '1M'. These give an order of magnitude for the dates returned '1M' for example actually returns a couple months worth of data.

## Querying AWS

The API is hosted on a public EC2 instance with an entry-point of the format: http://proem-io-api-dev.us-east-1.elasticbeanstalk.com/<query>
New version of the API can be deployed using:

```
eb deploy
```