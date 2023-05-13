import { WebSocketServer } from 'ws'; // yarn add ws
// import ws from 'ws'; yarn add ws@7
// const WebSocketServer = ws.Server;
import { useServer } from 'graphql-ws/lib/use/ws';
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
 
/**
 * Construct a GraphQL schema and define the necessary resolvers.
 *
 * type Query {
 *   hello: String
 * }
 * type Subscription {
 *   greetings: String
 * }
 */
export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => 'world',
      },
    },
  }),
  subscription: new GraphQLObjectType({
    name: 'Subscription',
    fields: {
      greetings: {
        type: GraphQLString,
        subscribe: async function* () {
          for (const hi of ['Hi', 'Bonjour', 'Hola', 'Ciao', 'Zdravo']) {
            yield { greetings: hi };
          }
        },
      },
    },
  }),
});


const server = new WebSocketServer({
  port: 8080,
  path: '/_ws/'
});
 
useServer(
  { 
    schema,
   /*
    onDisconnect(ctx, code, reason) {
      console.log('Disconnected!');
      console.log('Disconnect Reason:');
      console.log( JSON.stringify(reason));
      console.log("---------------");
      console.log('Disconnect Code:');
      console.log(JSON.stringify(code));
      console.log("---------------");

    }, */
 },
 server);
 
console.log('Listening to port 8080');

server.on('connection', function (ws, request) {
   console.log('Connection is called');
   console.log(JSON.stringify(request.headers));

   ws.on('message', function (message) {
     console.log('onMessage data: ' + message);
   });

   ws.on('error', function(err) {
    console.log('error: ' + JSON.stringify(err));
  });

   ws.on('close', function(code, reason) {
     console.log(JSON.stringify(ws._closeMessage));
     console.log('ws is closed with code: ' + code + ' reason: '+ reason);
   });

 });



