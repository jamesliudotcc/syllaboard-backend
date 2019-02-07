import {
  createConnection,
  getMongoManager,
  getMongoRepository,
  getRepository,
} from 'typeorm';

import { Assignment } from './Assignment';
import { Cohort } from './Cohort';
import { Deliverable } from './Deliverable';
import { User } from './User';
// import { Topic } from './Topic';

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
    const userRepository = getRepository(User);
    const deliverableRepository = getMongoRepository(Deliverable);
    const assignmentRepository = getRepository(Assignment);
    const cohortRepository = getRepository(Cohort);
    const manager = getMongoManager();

    // // Uncomment to run functions to populate mock data:
    // await createAssignment(userRepository, assignmentRepository, manager);

    // // Assignment to each member of cohort
    // await assignmentToDeliverables();

    // // Student hands in deliverable with URL:
    // await handInAssignment(userRepository, deliverableRepository, manager);

    // // Instructor finds all deliverables marked turned in
    // await gradeTurnedInDeliverable(deliverableRepository, manager);
  } catch (error) {
    console.log('Something went wrong', error);
  }
});

async function gradeTurnedInDeliverable(deliverableRepository, manager) {
  const allDelivered = await deliverableRepository.find({
    where: { turnedIn: { $ne: null } },
  });
  console.log(allDelivered[0]._id);
  // Get ID of the one deliverable, which is [0] here
  // This will come in from the form usually.
  const deliveredID = allDelivered[0];
  // Get the deliverable by ID and update the completed and grade fields
  const acceptedAssignment = await manager.updateOne(Deliverable, deliveredID, {
    $set: { completed: true, grade: '20' },
  });
  console.log(acceptedAssignment);
  const accepted = await deliverableRepository.find({
    where: { turnedIn: { $ne: null } },
  });
  console.log(accepted[0]);
}

async function handInAssignment(
  userRepository,
  deliverableRepository,
  manager,
) {
  const someStudent = await userRepository.findOne({
    where: { lastName: 'Hulbert' },
  });
  // Student pulls a particular deliverable from the list of deliverables
  const someDeliverable = await deliverableRepository.findOne(
    someStudent.deliverables[0],
  );
  console.log(someDeliverable);
  //  Student turns in assignment
  const savedAssignment = await manager.updateOne(
    Deliverable,
    someDeliverable,
    {
      $set: { turnedIn: new Date(), deliverable: 'http://www.google.com' },
    },
  );
  console.log(savedAssignment);
}

async function assignmentToDeliverables() {
  const userRepository = getRepository(User);
  const assignmentRepository = getRepository(Assignment);
  const cohortRepository = getRepository(Cohort);
  const deliverableRepository = getRepository(Deliverable);
  const manager = getMongoManager();

  const thisAssignment = await assignmentRepository.findOne();
  console.log(thisAssignment);
  // Pull out a cohort
  const thisCohort = await cohortRepository.findOne({
    where: { name: 'WDI22' },
  });
  thisCohort.students.forEach(async studentId => {
    // For each id in cohort, pull a student
    // Create a new Deliverable, copying assignment into new deliverable
    const deliverable = new Deliverable();
    deliverable.name = thisAssignment.name;
    deliverable.student.push(studentId);
    deliverable.cohort.push(thisCohort._id);
    deliverable.instructions = thisAssignment.instructions;
    deliverable.instructor = thisAssignment.instructor;
    deliverable.resourcesUrls = thisAssignment.resourcesUrls;
    deliverable.topics = thisAssignment.topics;
    deliverable.deadline = new Date('2019-02-11');

    const freshDeliverable = await manager.save(deliverable);
    const savedDeliverable = await deliverableRepository.findOne(
      freshDeliverable,
    );

    // Save deliverable to student
    const student = await userRepository.findOne(studentId);

    student.deliverables.push(savedDeliverable._id);
    // console.log(student);
    const savedStudent = await manager.save(student);
    console.log(savedStudent);

    // Push deliverable
  });
}

async function createAssignment(userRepository, assignmentRepository, manager) {
  const someIntructor = await userRepository.findOne({
    where: { role: 'instructor' },
  });
  const assignment1: Assignment = new Assignment();
  assignment1.name = 'Resume';
  assignment1.instructor.push(someIntructor._id);
  assignment1.version = 1;
  assignment1.cohortType = ['WDI', 'UXDI', 'DSI'];
  assignment1.cohortWeek = '1';
  assignment1.instructions = 'Create a resume';
  assignment1.resourcesUrls = [
    'https://zety.com/blog/how-to-make-a-resume',
    'https://www.thebalancecareers.com/how-to-create-a-professional-resume-2063237',
  ];
  const createdAssignment1 = await assignmentRepository.create(assignment1);
  const savedAssignment1 = await manager.save(createdAssignment1);
  console.log(savedAssignment1);

  const assignment2: Assignment = new Assignment();
  assignment2.name = 'Resume';
  assignment2.instructor.push(someIntructor._id);
  assignment2.version = 1;
  assignment2.cohortType = ['WDI', 'UXDI', 'DSI'];
  assignment2.cohortWeek = '1';
  assignment2.instructions = 'Create a cover letter';
  assignment2.resourcesUrls = [
    'https://zety.com/blog/how-to-make-a-cover-letter',
  ];
  const createdAssignment2 = await assignmentRepository.create(assignment2);
  const savedAssignment2 = await manager.save(createdAssignment2);
  console.log(savedAssignment2);
}
