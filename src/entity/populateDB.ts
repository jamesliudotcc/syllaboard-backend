import {
  createConnection,
  getMongoManager,
  getMongoRepository,
  getRepository,
  MongoEntityManager,
} from 'typeorm';

import { Assignment } from './Assignment';
import { Cohort } from './Cohort';
import { Deliverable } from './Deliverable';
import { User } from './User';

createConnection({
  type: 'mongodb',
  host: process.env.MONGO_URL,
  port: Number(process.env.MONGO_PORT),
  database: 'test3',
  entities: [Assignment, Cohort, Deliverable, User],
  useNewUrlParser: true,
  synchronize: true,
  logging: false,
}).then(async connection => {
  try {
    const manager = getMongoManager();
    // Uncomment and run for mock data
    // createUsers(manager);
    // await createCohorts(manager);

    // Populate Cohorts with students
    const userRepository = getMongoRepository(User);
    const cohortRepository = getMongoRepository(Cohort);

    const WDI22 = await cohortRepository.findOne({ where: { name: 'WDI22' } });
    console.log(WDI22.name, WDI22._id, WDI22.students);
    const UXDI22 = await cohortRepository.findOne({
      where: { name: 'UXDI22' },
    });
    console.log(UXDI22.name, UXDI22._id);
    const someUsers = await userRepository.find({ take: 10 });
    const nextUsers = await userRepository.find({ skip: 10 });

    // someUsers
    //   .filter(user => user.role === 'student')
    //   .forEach(async user => {
    //     console.log(user._id);
    //     const a = WDI22.students.push(user._id);
    //     console.log(a);
    //     manager.save(WDI22);
    //   });
    nextUsers
      .filter(user => user.role === 'student')
      .forEach(user => {
        UXDI22.students.push(user._id);
        console.log(user.firstName, user.lastName, user.role, 'to UXDI22');
        manager.save(UXDI22);
      });
  } catch (error) {
    console.log('Something went wrong', error);
  }
});

async function createCohorts(manager: MongoEntityManager) {
  const cohortRepository = getRepository(Cohort);
  const cohort1: Cohort = new Cohort();
  cohort1.name = 'WDI22';
  cohort1.campus = 'Seattle';
  cohort1.startDate = new Date('2018-11-26');
  cohort1.endDate = new Date('2019-03-01');
  // cohort1.students = [];
  // cohort1.instructors = [];

  const cohort2: Cohort = new Cohort();
  cohort2.name = 'UXDI22';
  cohort2.campus = 'Seattle';
  cohort2.startDate = new Date('2018-11-26');
  cohort2.endDate = new Date('2019-03-01');

  const createdCohort1 = await cohortRepository.create(cohort1);
  const savedCohort1 = await manager.save(createdCohort1);
  console.log(savedCohort1);

  const createdCohort2 = await cohortRepository.create(cohort2);
  const savedCohort2 = await manager.save(createdCohort2);
  console.log(savedCohort2);
}

function createUsers(manager: MongoEntityManager) {
  // Most of this function is the mock data

  const userRepository = getRepository(User);

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
}
