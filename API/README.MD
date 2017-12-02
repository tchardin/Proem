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

That's done with the environment set up. To run our api,  cd into the API directory (proemgsql) and run :
```
python manage.py runserver

```
API calls can now be made to `http://0.0.0.0:8000/`.

## GraphQL API

The endpoint to post to is
- http://proemgsql-dev.us-east-1.elasticbeanstalk.com/graphql/

If opened in a browser, this link includes documentation for each of the endpoints in a UI. Note that each endpoint in the API is independently queryable. Each endpoint requires coins and fiat arguments. The candles endpoint requires an additional interval argument. The API uses a connection to a database that contains all historical values for coin-USD pairs. This database can be created using the `create_database.sh` file and is linked to the API in the settings.py file in the proemgsql folder. The api_package folder, contained within proemgsql, contains API specific data processing functions that normalises and formats data from different exchange APIs.

API servers are managed by AWS beanstalk. New API instances can be deployed within the command line using:

```
eb deploy
```

## Database Maintenance
 To automate the maintenance of the database of daily historical data and a local cache of minute precision values run:

```
cd maintain_db
ssh -i "proem-key-pair.pem" ec2-user@ec2-54-191-34-79.us-west-2.compute.amazonaws.com
crontab -e
01 00 * * * /home/ec2-user/Proem/API/create_database.sh
:wq
```

To kill, with PID:
```
ps -ef | grep python
kill -9 PID
```

or if using crontab:
```
cd
crontab -r
```

To update the RDS database using csv files, run:

```
python create_database.sh
```
