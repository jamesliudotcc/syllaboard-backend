// tslint:disable:no-var-requires
const en = require('nanoid-good/locale/en');
const nanoid = require('nanoid-good')(en);
// tslint:enable:no-var-requires

import { createConnection, getMongoManager, getRepository } from 'typeorm';

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
    const assignmentRepository = getRepository(Assignment);
    const cohortRepository = getRepository(Cohort);
    const manager = getMongoManager();

    // Uncomment to run functions to populate mock data:

    // await createAssignment(userRepository, assignmentRepository, manager);
    // Uncomment to run functions to populate mock data:

    // await createAssignment(userRepository, assignmentRepository, manager);

    // Assignment to each member of cohort

    await assignmentToDeliverables();

    // Student hands in deliverable with URL:
    // Student pulls a particular deliverable from the list of deliverables

    // // It gets marked turned in.

    // Instructor can find all turned in deliverables

    // Instructor can find all turned in deliverables

    // const users = await userRepository.find();
    // const students = users
    //   .filter(s => s.role === 'student')
    //   .filter(s => s.deliverables.length >= 1)
    //   .map(s => ({ student: s._id, deliverables: s.deliverables }));
    // // console.log(students);
    // // Also pass down student name.

    // const flatSingle = arr => [].concat(...arr);

    // const flattenedStudents = flatSingle(
    //   students.map(eachFlatStudent =>
    //     eachFlatStudent.deliverables.map(deliverable => ({
    //       student: eachFlatStudent.student,
    //       // tslint:disable-next-line
    //       deliverable: deliverable,
    //     })),
    //   ),
    // );
    // const studentDeliverables = flattenedStudents.map(studentDeliverable => ({
    //   student: studentDeliverable.student,
    //   turnedIn: studentDeliverable.deliverable.turnedIn,
    //   deliverableName: studentDeliverable.deliverable.name,
    //   deliverableUrl: studentDeliverable.deliverable.deliverable,
    //   deliverableId: studentDeliverable.deliverable._id,
    // }));

    // const turnedIn = studentDeliverables.filter(
    //   d => d.turnedIn !== null && d.turnedIn !== undefined,
    // );

    // Intructor can mark as completed and with a grade.

    // const toMarkDone = await userRepository.findOne(turnedIn[0].student);
    // console.log(toMarkDone);
  } catch (error) {
    console.log('Something went wrong', error);
  }
});

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
  thisCohort.students.forEach(async student => {
    // For each id in cohort, pull a student
    // Create a new Deliverable, copying assignment into new deliverable
    const deliverable = new Deliverable();
    deliverable.name = thisAssignment.name;
    deliverable.student.push(student);
    deliverable.instructions = thisAssignment.instructions;
    deliverable.instructor = thisAssignment.instructor;
    deliverable.resourcesUrls = thisAssignment.resourcesUrls;
    deliverable.topics = thisAssignment.topics;
    deliverable.deadline = new Date('2019-02-11');

    const savedDeliverable = await manager.save(deliverable);
    console.log(savedDeliverable);

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
