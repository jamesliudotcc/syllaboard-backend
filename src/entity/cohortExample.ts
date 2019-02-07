import { createConnection, getMongoManager, getRepository } from 'typeorm';
import { Cohort } from './Cohort';
import { Deliverable } from './Deliverable';
import { User } from './User';

createConnection({
  type: 'mongodb',
  host: process.env.MONGO_URL,
  port: Number(process.env.MONGO_PORT),
  database: 'test3',
  entities: [User, Cohort, Deliverable],
  useNewUrlParser: true,
  synchronize: true,
  logging: false,
}).then(async connection => {
  try {
    const userRepository = getRepository(User);
    const assignmentRepository = getRepository(Deliverable);
    const cohortRepository = getRepository(Cohort);
    const manager = getMongoManager();

    const Cohort1: Cohort = new Cohort();
    Cohort1.name = 'WDI Test';
    Cohort1.campus = 'Seattle';
    Cohort1.startDate = new Date('2018-11-26');
    Cohort1.endDate = new Date('2019-03-01');
    Cohort1.students = [];

    const savedCohort = await manager.save(Cohort1);
    console.log(savedCohort);

    const Assignment1 = {
      student: '5c58aa8dc4990b39dd2eefb9',
      instructor: '5c588927a3aa0d038d6763c6',
      instructions: 'Create a resume',
      resourcesUrls: [
        'https://zety.com/blog/how-to-make-a-resume',
        'https://www.thebalancecareers.com/how-to-create-a-professional-resume-2063237',
      ],
      deadline: new Date('2019-02-17'),
    };

    // const createdAssignment = await assignmentRepository.create(Assignment1);
    // const savedAssignment = await manager.save(createdAssignment);
    // console.log(savedAssignment);
  } catch (error) {
    console.log('Something went wrong', error);
  }
});
