from application import db
from sqlalchemy import create_engine
from sqlalchemy.ext.automap import automap_base

Base = automap_base()

e = create_engine('sqlite:///bitfinex.db')

Base.prepare(e, reflect=True)

BTC,ETH,LTC = Base.classes.BTC,Base.classes.ETH,Base.classes.LTC
