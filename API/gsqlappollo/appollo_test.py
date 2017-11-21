from flask import Flask
from flask_sockets import Sockets
from graphql_subscriptions import (
    SubscriptionManager,
    RedisPubsub,
    SubscriptionServer
)
import graphene
import graphene_sqlalchemy
import websocket


app = Flask(__name__)

# using Flask Sockets here, but could use gevent-websocket directly
# to create a websocket app and attach it to flask app object
sockets = Sockets(app)

# instantiate pubsub -- this will be used to "publish" mutations
# and also to pass it into your subscription manager
pubsub = RedisPubsub()

class Query(graphene.ObjectType):
    base = graphene.String()

class Subscription(graphene.ObjectType):
    users = graphene.String()
    # mutation oject that was published will be passed as
    # root_value of subscription
    async def resolve_bft_ticker(root, info):
        ws_bft = websocket.create_connection("wss://api.bitfinex.com/ws/2")
        ws_bft.send(json.dumps({
        "event": "subscribe",
        "channel": "ticker",
        "symbol": "tBTCUSD"
        }))
        while True:
            resp = ws_bft.recv()
            await asyncio.sleep(1.)
            resp = ast.literal_eval(resp)
            if (not isinstance(resp, dict)):
                if (not isinstance(resp[1], str)):
                    data = [str(datetime.now())] + [float(resp[1][i]) for i in [-2,-1,-4,0,2,-3]]
                    data.insert(3,(data[1]+data[2])/2.0)
                    resp = dict(zip(tuple(ticker_keys), data))
                    yield str(resp)

    # def resolve_users(self, args, context, info):
    #     with app.app_context():
    #         query = User.get_query(context)
    #         return query.filter_by(id=info.root_value.get('id'))
# create schema using graphene or another python graphql library
# not showing models or schema design here for brevity
schema = graphene.Schema(
    query=Query,
    subscription=Subscription
)

# instantiate subscription manager object -- passing in schema and pubsub
subscription_mgr = SubscriptionManager(schema, pubsub)

# using Flask Sockets here -- on each new connection instantiate a
# subscription app / server -- passing in subscription manager and websocket
@sockets.route('/socket')
def socket_channel(websocket):
    subscription_server = SubscriptionServer(subscription_mgr, websocket)
    subscription_server.handle()
    return []


if __name__ == "__main__":

    # using a gevent webserver so multiple connections can be
    # maintained concurrently -- gevent websocket spawns a new
    # greenlet for each request and forwards the request to flask
    # app or socket app, depending on request type
    from geventwebsocket import WebSocketServer

    server = WebSocketServer(('', 5000), app)
    print(' Serving at host 0.0.0.0:5000...\n')
    server.serve_forever()
