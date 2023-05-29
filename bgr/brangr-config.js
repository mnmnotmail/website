// Demo config - Brangr v0.x

export default  {
   test: true,

   title: 'Demo',
   notes: 'A Brangr demo by its author. It calls public GraphQL services for \
           SpaceX info, the Star Wars API ("swapi"), and countries of the world. \
           Sadly, the whole "countries" site schema doesn\'t load, \
           because that site limits the size of queries. (I\'m hopeful that could change \
           for schema queries if someone asks github.com/trevorblades nicely :)',
   url: 'https://github.com/networkimprov/brangr',

   targets: {
      spacex: 'https://spacex-production.up.railway.app/',
      swapi: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
      countries: 'https://countries.trevorblades.com/graphql',
   },

   show: 'SpaceX',
// run: 'file',

   qs: [{
      name: 'SpaceX',
      site: 'spacex',
      url:  './q-spacex.txt',
   },{
      name: 'countries',
      site: 'countries',
      text: '{ __schema {\n  queryType {\n    fields(_layout:{type:table}) {\n\
      name\n      args(_layout:{type:cell}) { name }\n    }\n  }\n}}',
   },{
      name: 'StarWars',
      site: 'swapi',
      url:  './q-swapi.txt',
   }],

   schemaQ: '{ __schema {\
   ##description\n\
     queryType { name }\
     mutationType { name }\
     subscriptionType { name }\
     types {\
       name kind description\
   ##  specifiedByURL\n\
       fields {\
         name description\
         args {\
           name description defaultValue\
           type { ...typeFields }\
         }\
         type { ...typeFields }\
       }\
       interfaces { name }\
       possibleTypes { name }\
       enumValues { name description }\
       inputFields {\
         name description defaultValue\
         type { ...typeFields }\
       }\
     }\
     directives {\
       name description locations\
   ##  isRepeatable\n\
       args {\
         name description defaultValue\
         type { ...typeFields }\
       }\
     }\
   }}\
   fragment typeFields on __Type {\
     name kind\
     ofType {\
       name kind\
       ofType {\
         name kind\
         ofType { name } # may need: name kind ofType { name }\n\
       }\
     }\
   }',

};
