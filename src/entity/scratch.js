
console.log(generatedUsers())

function generatedUsers() { return ([{
    "firstName": "Constance",
    "lastName": "McNeillie",
    "email": "cmcneillie0@nih.gov",
    "password": "Caryophyllaceae"
  }, {
    "firstName": "Cindie",
    "lastName": "Brokenbrow",
    "email": "cbrokenbrow1@cmu.edu",
    "password": "Fagaceae"
  }, {
    "firstName": "Sandy",
    "lastName": "Hulbert",
    "email": "shulbert2@diigo.com",
    "password": "Arctomiaceae"
  }].map(user => ({...user, role: 'admin'})))
}