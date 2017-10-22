import graphene

import historicaldata.schema

# 
class Query(historicaldata.schema.Query, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query)
