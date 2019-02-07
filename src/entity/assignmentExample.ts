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

    // await assignmentToDeliverables(
    //   assignmentRepository,
    //   cohortRepository,
    //   userRepository,
    // );

    // Student hands in deliverable with URL:
    // Student pulls a particular deliverable from the list of deliverables

    // const cindieB = await userRepository.findOne('5c5b896c7215241d1d2da7e4');
    // console.log(cindieB.deliverables[0].instructions);

    // // It gets marked turned in.

    // cindieB.deliverables[0].turnedIn = new Date();
    // cindieB.deliverables[0].deliverable = 'www.google.com';
    // // 1st CindieB tells what to update, 2nd updates it with CindieB as updated
    // await userRepository.update(cindieB, cindieB);

    // Instructor can find all turned in deliverables

    const users = await userRepository.find();
    const students = users
      .filter(s => s.role === 'student')
      .filter(s => s.deliverables.length >= 1)
      .map(s => ({ student: s._id, deliverables: s.deliverables }));
    // console.log(students);
    // Also pass down student name.

    const flatSingle = arr => [].concat(...arr);

    const flattenedStudents = flatSingle(
      students.map(eachFlatStudent =>
        eachFlatStudent.deliverables.map(deliverable => ({
          student: eachFlatStudent.student,
          deliverable: deliverable,
        })),
      ),
    );
    const studentDeliverables = flattenedStudents.map(studentDeliverable => ({
      student: studentDeliverable.student,
      turnedIn: studentDeliverable.deliverable.turnedIn,
      deliverableName: studentDeliverable.deliverable.name,
      deliverableUrl: studentDeliverable.deliverable.deliverable,
      deliverableId: studentDeliverable.deliverable._id,
    }));

    const turnedIn = studentDeliverables.filter(
      d => d.turnedIn !== null && d.turnedIn !== undefined,
    );
    console.log(turnedIn);
    // const turnedIn = students.filter(student =>
    //   student.deliverables.filter(deliverable => deliverable.turnedIn !== null),
    // );

    // console.log(turnedIn.forEach(e => e.deliverables[0].turnedIn));

    // Intructor can mark as completed and with a grade.
  } catch (error) {
    console.log('Something went wrong', error);
  }
});

async function assignmentToDeliverables(
  assignmentRepository,
  cohortRepository,
  userRepository,
) {
  const thisAssignment = await assignmentRepository.findOne();
  console.log(thisAssignment);
  // Pull out a cohort
  const thisCohort = await cohortRepository.findOne({
    where: { name: 'WDI22' },
  });
  thisCohort.students.forEach(async student => {
    // For each id in cohort, pull a student
    const thisStudent = await userRepository.findOne({ _id: student });
    // Create a new Deliverable, copying assignment into new deliverable
    const studentDeliverable = new Deliverable();
    studentDeliverable.name = thisAssignment.name;
    studentDeliverable.instructions = thisAssignment.instructions;
    studentDeliverable.instructor = thisAssignment.instructor;
    studentDeliverable.resourcesUrls = thisAssignment.resourcesUrls;
    studentDeliverable.topics = thisAssignment.topics;
    studentDeliverable.deadline = new Date('2019-02-11');
    studentDeliverable._id = nanoid();
    // Push deliverable
    thisStudent.deliverables.push(studentDeliverable);
    await userRepository.update(thisStudent, thisStudent);
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
  const createdAssignment = await assignmentRepository.create(assignment1);
  const savedAssignment = await manager.save(createdAssignment);
  console.log(savedAssignment);
}
