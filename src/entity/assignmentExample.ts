import { createConnection, getMongoManager, getRepository } from 'typeorm';

import { Assignment } from './Assignment';
import { Cohort } from './Cohort';
import { User } from './User';
// import { Topic } from './Topic';

createConnection({
  type: 'mongodb',
  host: process.env.MONGO_URL,
  port: Number(process.env.MONGO_PORT),
  database: 'test3',
  entities: [Assignment, Cohort, User],
  useNewUrlParser: true,
  synchronize: true,
  logging: false,
}).then(async connection => {
  try {
    const userRepository = getRepository(User);
    const assignmentRepository = getRepository(Assignment);
    const cohortRepository = getRepository(Cohort);
    const manager = getMongoManager();

    // Uncomment to run functions to populate mock data:

    // await createAssignment(userRepository, assignmentRepository, manager);

    // Assignment to each member of cohort

    // Pull out a cohort

    const thisCohort = await cohortRepository.findOne({
      where: { name: 'WDI22' },
    });
    console.log(thisCohort.students);
    // For each id in cohort, pull a student
    // Create a new Deliverable, copying assignment into new deliverable

    // Push deliverable
  } catch (error) {
    console.log('Something went wrong', error);
  }
});

async function createAssignment(userRepository, assignmentRepository, manager) {
  const someIntructor = await userRepository.findOne({
    where: { role: 'instructor' },
  });
  const assignment1: Assignment = new Assignment();
  assignment1.instructor.push(someIntructor._id);
  assignment1.version = 1;
  assignment1.cohortType = ['WDI', 'UXDI', 'DSI'];
  assignment1.cohortWeek = '1';
  assignment1.instructions = 'Create a resume';
  assignment1.resourcesUrls = [
    'https://zety.com/blog/how-to-make-a-resume',
    'https://www.thebalancecareers.com/how-to-create-a-professional-resume-2063237',
  ];
  const createdAssignment = await assignmentRepository.create(assignment1);
  const savedAssignment = await manager.save(createdAssignment);
  console.log(savedAssignment);
}
