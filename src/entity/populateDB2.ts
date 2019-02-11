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
    // await populateCohorts(manager);
  } catch (error) {
    console.log('Something went wrong', error);
  }
});

async function populateCohorts(manager: MongoEntityManager) {
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
  someUsers
    .filter(user => user.role === 'student')
    .forEach(async user => {
      WDI22.students.push(user._id);
      console.log(user.firstName, user.lastName, user.role, 'to WDI22');
      manager.save(WDI22);
    });
  nextUsers
    .filter(user => user.role === 'student')
    .forEach(user => {
      UXDI22.students.push(user._id);
      console.log(user.firstName, user.lastName, user.role, 'to UXDI22');
      manager.save(UXDI22);
    });
}

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
        first_name: 'Dennet',
        last_name: 'McNirlan',
        email: 'dmcnirlan0@dailymotion.com',
      },
      {
        first_name: 'Sigvard',
        last_name: 'Itzkin',
        email: 'sitzkin1@engadget.com',
      },
      {
        first_name: 'Courtney',
        last_name: 'Faill',
        email: 'cfaill2@nps.gov',
      },
      {
        first_name: 'Townsend',
        last_name: 'Graveston',
        email: 'tgraveston3@wordpress.org',
      },
      {
        first_name: 'Kanya',
        last_name: 'Archard',
        email: 'karchard4@technorati.com',
      },
      {
        first_name: 'Harli',
        last_name: 'Boydell',
        email: 'hboydell5@icio.us',
      },
      {
        first_name: 'Don',
        last_name: 'Huckabe',
        email: 'dhuckabe6@mtv.com',
      },
      {
        first_name: 'Neely',
        last_name: 'Goulthorp',
        email: 'ngoulthorp7@t.co',
      },
      {
        first_name: 'Barthel',
        last_name: 'Kennion',
        email: 'bkennion8@bigcartel.com',
      },
      {
        first_name: 'Fernando',
        last_name: 'Coldwell',
        email: 'fcoldwell9@sfgate.com',
      },
      {
        first_name: 'Lydon',
        last_name: 'Playfoot',
        email: 'lplayfoota@ox.ac.uk',
      },
      {
        first_name: 'Lelah',
        last_name: 'Campagne',
        email: 'lcampagneb@cmu.edu',
      },
      {
        first_name: 'Maura',
        last_name: 'Bourdas',
        email: 'mbourdasc@marriott.com',
      },
      {
        first_name: 'Giuditta',
        last_name: 'Daunay',
        email: 'gdaunayd@wp.com',
      },
      {
        first_name: 'Dominica',
        last_name: 'Carnihan',
        email: 'dcarnihane@privacy.gov.au',
      },
      {
        first_name: 'Richy',
        last_name: 'Bradnick',
        email: 'rbradnickf@alibaba.com',
      },
      {
        first_name: 'Mattheus',
        last_name: 'Blowick',
        email: 'mblowickg@google.pl',
      },
      {
        first_name: 'Jillana',
        last_name: 'Picard',
        email: 'jpicardh@microsoft.com',
      },
      {
        first_name: 'Lurleen',
        last_name: 'Tomowicz',
        email: 'ltomowiczi@barnesandnoble.com',
      },
      {
        first_name: 'Bjorn',
        last_name: 'Kohen',
        email: 'bkohenj@hud.gov',
      },
      {
        first_name: 'Katrine',
        last_name: 'Basson',
        email: 'kbassonk@unicef.org',
      },
      {
        first_name: 'Paul',
        last_name: 'Turle',
        email: 'pturlel@bing.com',
      },
      {
        first_name: 'Harland',
        last_name: 'Woolsey',
        email: 'hwoolseym@nytimes.com',
      },
      {
        first_name: 'Marsha',
        last_name: 'Issatt',
        email: 'missattn@freewebs.com',
      },
      {
        first_name: 'Kristopher',
        last_name: 'Fosken',
        email: 'kfoskeno@lycos.com',
      },
      {
        first_name: 'Susann',
        last_name: 'Sherwill',
        email: 'ssherwillp@google.it',
      },
      {
        first_name: 'Palmer',
        last_name: 'Fronzek',
        email: 'pfronzekq@netvibes.com',
      },
      {
        first_name: 'Kayley',
        last_name: 'Spary',
        email: 'ksparyr@odnoklassniki.ru',
      },
      {
        first_name: 'Cybill',
        last_name: 'Okenden',
        email: 'cokendens@myspace.com',
      },
      {
        first_name: 'Blinni',
        last_name: 'Bolle',
        email: 'bbollet@gizmodo.com',
      },
      {
        first_name: 'Danny',
        last_name: 'Hempel',
        email: 'dhempelu@arstechnica.com',
      },
      {
        first_name: 'Quint',
        last_name: 'Broz',
        email: 'qbrozv@slideshare.net',
      },
      {
        first_name: 'Stavro',
        last_name: "O'Mohun",
        email: 'somohunw@e-recht24.de',
      },
      {
        first_name: 'Iona',
        last_name: 'Gyves',
        email: 'igyvesx@nih.gov',
      },
      {
        first_name: 'Harrietta',
        last_name: 'Draude',
        email: 'hdraudey@tiny.cc',
      },
      {
        first_name: 'Claudetta',
        last_name: 'Wysome',
        email: 'cwysomez@hao123.com',
      },
      {
        first_name: 'Farlie',
        last_name: 'Burne',
        email: 'fburne10@ameblo.jp',
      },
      {
        first_name: 'Jaclin',
        last_name: 'Clunie',
        email: 'jclunie11@gnu.org',
      },
      {
        first_name: 'Gino',
        last_name: 'Shipsey',
        email: 'gshipsey12@plala.or.jp',
      },
      {
        first_name: 'Liuka',
        last_name: 'Karpmann',
        email: 'lkarpmann13@nbcnews.com',
      },
      {
        first_name: 'Filberto',
        last_name: 'Kelcher',
        email: 'fkelcher14@tamu.edu',
      },
      {
        first_name: 'Aviva',
        last_name: "O'Keenan",
        email: 'aokeenan15@kickstarter.com',
      },
    ].map(user => ({ ...user, role: 'student', password: 'password' }));
  }

  function generatedInstructors() {
    return [
      {
        firstName: 'Brandi',
        lastName: 'Butler',
        email: 'brandi@ga.co',
      },
      {
        firstName: 'Taylor',
        lastName: 'Darneille',
        email: 'taylor@ga.co',
      },
    ].map(user => ({ ...user, role: 'instructor', password: 'password' }));
  }

  function generatedAdmins() {
    return [
      {
        firstName: 'James',
        lastName: 'Liu',
        email: 'james@jamesliu.cc',
      },
      {
        firstName: 'Sarah',
        lastName: 'King',
        email: '009kings@gmail.com',
      },
      {
        firstName: 'Parker',
        lastName: 'Couch',
        email: 'parkercouch@gmail.com',
      },
    ].map(user => ({ ...user, role: 'admin', password: 'password' }));
  }
}
