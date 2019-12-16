# movieApi
Simple movie api interacting with OMDb API.
Clone repository, install dependiences, create a config.json file as in the attached template. 
  - To run tests type "npm test".
  - To run in dev enviroment type "npm run dev"
  
# api is running on https://lucjan-movie-api.herokuapp.com/

# routes:
  - POST /movies 
      body require title property with movie title from OMDB API
  - GET /movies
      returns movies with comments (oprional params in query string page and limit - dafult 10)
  - POST /comments/{movieId}
      body require author and comment properties
  - GET /comments
      retruns all comments
