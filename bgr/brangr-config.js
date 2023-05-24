/* Configuration - Brangr v0.2
   For the source code and latest release, see https://github.com/networkimprov/brangr

   Edit this file as appropriate for your GraphQL site, and rename it brangr_config.js
*/

export default  {
   // Info for this GraphQL site; appears on Docs page
   title: 'Demo',
   notes: 'A Brangr demo by its author. It calls public GraphQL services for \
           SpaceX info, the Star Wars API ("swapi"), and countries of the world. \
           Sadly, the whole "countries" site schema doesn\'t load, \
           because that site limits the size of queries. (I\'m hopeful that could change \
           for schema queries if someone asks github.com/trevorblades nicely :)',
   url: 'https://github.com/networkimprov/brangr',

   // One or more URLs to GraphQL endpoints; can be a string, array, or object
   targets: {
      spacex: 'https://spacex-production.up.railway.app/',
      swapi: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
      countries: 'https://countries.trevorblades.com/graphql',
   },
// targets: 'url',
// targets: ['url', 'url2'],
// targets: {one: 'url', two: 'url2'}, // provides CSS classes .site-one & .site-two

   // Name of a query page to display when Brangr loads
   show: 'SpaceX',

   // Name of a query page to display and run when Brangr loads (supersedes .show)
// run: 'file',

   // Set of query pages available when Brangr loads, with fields:
   //   name - title of the query page
   //   text - text of the query, or...
   //   url  - text of the query is online at this address (supersedes .text)
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

   // Query that loads the GraphQL schema for any of the .targets URLs
   // If needed, revise the fragment 'typeFields' to support longer ofType chains.
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
