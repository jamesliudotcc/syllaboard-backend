import { Assignment } from '../../entity/Assignment';
import { Deliverable } from '../../entity/Deliverable';

export function editAssignment(
  toEditAssignmeent: Assignment,
  incoming: any,
): Assignment {
  const editedAssignment = { ...toEditAssignmeent };
  if (incoming.firstName) {
    editedAssignment.cohortType = incoming.cohortType;
  }
  if (incoming.lastName) {
    editedAssignment.cohortWeek = incoming.cohortWeek;
  }
  if (incoming.instructions) {
    editedAssignment.instructions = incoming.instructions;
  }
  if (incoming.instructor) {
    editedAssignment.instructor = incoming.instructor;
  }
  if (incoming.name) {
    editedAssignment.name = incoming.name;
  }
  if (incoming.resourcesUrls) {
    editedAssignment.resourcesUrls = incoming.resourcesUrls;
  }
  if (incoming.topics) {
    editedAssignment.topics = incoming.topics;
  }
  if (incoming.version) {
    editedAssignment.version++;
  } else {
    editedAssignment.version = 1;
  }
  return editedAssignment;
}
export function editDeliverable(deliverable: Deliverable, incoming: any): any {
  const editedDeliverable = { ...deliverable };
  //
  console.log('Marking deliverable completed', incoming);
  editedDeliverable.completed = incoming.completed
    ? new Date(incoming.completed)
    : null;
  if (incoming.grade) {
    editedDeliverable.grade = incoming.grade;
  }
  return editedDeliverable;
}
