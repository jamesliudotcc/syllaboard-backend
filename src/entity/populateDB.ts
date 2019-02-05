import { createConnection, getMongoManager, getRepository } from 'typeorm';
import { User } from './User';

interface GenUser extends Object {
  role: 'admin' | 'instructor' | 'student';
}

createConnection({
  type: 'mongodb',
  host: process.env.MONGO_URL,
  port: Number(process.env.MONGO_PORT),
  database: 'test3',
  entities: [User],
  useNewUrlParser: true,
  synchronize: true,
  logging: false,
}).then(async connection => {
  try {
    const userRepository = getRepository(User);
    const manager = getMongoManager();
    createUsers(userRepository, manager);
  } catch (error) {
    console.log('Something went wrong', error);
  }
});

function createUsers(userRepository, manager) {
  const students = generatedStudents();
  const instructors = generatedInstructors();
  const admins = generatedAdmins();
  students.forEach(async student => {
    // @ts-ignore
    const createdStudent = await userRepository.create(student);
    const savedStudent = await manager.save(createdStudent);
    console.log(savedStudent);
  });
  instructors.forEach(async instructor => {
    // @ts-ignore
    const createdInstructor = await userRepository.create(instructor);
    const savedInstructor = await manager.save(createdInstructor);
    console.log(savedInstructor);
  });
  admins.forEach(async admin => {
    // @ts-ignore
    const createdAdmin = await userRepository.create(admin);
    const savedAdmin = await manager.save(createdAdmin);
    console.log(savedAdmin);
  });
}

function generatedStudents() {
  return [
    {
      firstName: 'Constance',
      lastName: 'McNeillie',
      email: 'cmcneillie0@nih.gov',
      password: 'Caryophyllaceae',
    },
    {
      firstName: 'Cindie',
      lastName: 'Brokenbrow',
      email: 'cbrokenbrow1@cmu.edu',
      password: 'Fagaceae',
    },
    {
      firstName: 'Sandy',
      lastName: 'Hulbert',
      email: 'shulbert2@diigo.com',
      password: 'Arctomiaceae',
    },
    {
      firstName: 'Ebeneser',
      lastName: 'Johnke',
      email: 'ejohnke3@wunderground.com',
      password: 'Urticaceae',
    },
    {
      firstName: 'Remington',
      lastName: 'Sandyford',
      email: 'rsandyford4@nydailynews.com',
      password: 'Lentibulariaceae',
    },
    {
      firstName: 'Gwyn',
      lastName: 'Stoyle',
      email: 'gstoyle5@webnode.com',
      password: 'Lichinaceae',
    },
    {
      firstName: 'Kimble',
      lastName: 'Mattedi',
      email: 'kmattedi6@nasa.gov',
      password: 'Lentibulariaceae',
    },
    {
      firstName: 'Audra',
      lastName: 'Mitchley',
      email: 'amitchley7@yahoo.com',
      password: 'Caryophyllaceae',
    },
    {
      firstName: 'Wesley',
      lastName: 'Stolberger',
      email: 'wstolberger8@jigsy.com',
      password: 'Boraginaceae',
    },
    {
      firstName: 'Lamar',
      lastName: 'Carrick',
      email: 'lcarrick9@youku.com',
      password: 'Ophioglossaceae',
    },
    {
      firstName: 'Izak',
      lastName: 'Branston',
      email: 'ibranstona@xrea.com',
      password: 'Asteraceae',
    },
    {
      firstName: 'Ware',
      lastName: 'Tomlett',
      email: 'wtomlettb@accuweather.com',
      password: 'Stereocaulaceae',
    },
    {
      firstName: 'Corbin',
      lastName: 'Goalby',
      email: 'cgoalbyc@netvibes.com',
      password: 'Parmeliaceae',
    },
    {
      firstName: 'Godfrey',
      lastName: 'Stickels',
      email: 'gstickelsd@webmd.com',
      password: 'Ericaceae',
    },
    {
      firstName: 'Rochette',
      lastName: 'Dawtrey',
      email: 'rdawtreye@vistaprint.com',
      password: 'Primulaceae',
    },
    {
      firstName: 'Debora',
      lastName: 'Timmins',
      email: 'dtimminsf@mail.ru',
      password: 'Poaceae',
    },
    {
      firstName: 'Lila',
      lastName: 'Martinez',
      email: 'lmartinezg@about.com',
      password: 'Polygonaceae',
    },
    {
      firstName: 'Aurilia',
      lastName: 'Affron',
      email: 'aaffronh@boston.com',
      password: 'Primulaceae',
    },
    {
      firstName: 'Lucia',
      lastName: 'Hawney',
      email: 'lhawneyi@tiny.cc',
      password: 'Fabaceae',
    },
    {
      firstName: 'Bruce',
      lastName: 'Thome',
      email: 'bthomej@toplist.cz',
      password: 'Chenopodiaceae',
    },
  ].map(user => ({ ...user, role: 'student' }));
}

function generatedInstructors() {
  return [
    {
      firstName: 'Kendrick',
      lastName: 'McGlone',
      email: 'kmcglone0@github.io',
      password: 'Pyrenulaceae',
    },
    {
      firstName: 'Joaquin',
      lastName: 'Windless',
      email: 'jwindless1@wikimedia.org',
      password: 'Polemoniaceae',
    },
    {
      firstName: 'Tiertza',
      lastName: 'Keling',
      email: 'tkeling2@godaddy.com',
      password: 'Pteridaceae',
    },
  ].map(user => ({ ...user, role: 'instructor' }));
}

function generatedAdmins() {
  return [
    {
      firstName: 'Domenico',
      lastName: 'Clemence',
      email: 'dclemence0@bloglines.com',
      password: 'Scrophulariaceae',
    },
    {
      firstName: 'Jenn',
      lastName: 'Occleshaw',
      email: 'joccleshaw1@unblog.fr',
      password: 'Pinaceae',
    },
    {
      firstName: 'Eugenio',
      lastName: 'Dyhouse',
      email: 'edyhouse2@opensource.org',
      password: 'Orchidaceae',
    },
  ].map(user => ({ ...user, role: 'admin' }));
}
