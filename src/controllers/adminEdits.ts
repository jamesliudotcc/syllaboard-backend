import { Cohort } from '../entity/Cohort';
import { User } from '../entity/User';

export function editCohort(
  toEditCohort: Cohort,
  incoming: any,
): {
  name?: string;
  campus?: string;
  startDate?: Date;
  endDate?: Date;
} {
  const editedCohort = { ...toEditCohort };
  if (incoming.name) {
    editedCohort.name = incoming.name;
  }
  if (incoming.campus) {
    editedCohort.campus = incoming.campus;
  }
  editedCohort.startDate = incoming.startDate
    ? new Date(incoming.startDate)
    : new Date(toEditCohort.startDate);
  editedCohort.endDate = incoming.endDate
    ? new Date(incoming.endDate)
    : new Date(toEditCohort.endDate);
  return editedCohort;
}
export function editUser(
  toEditUser: User,
  incoming: any,
): {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: 'admin' | 'instructor' | 'student';
} {
  const editedUser = { ...toEditUser };
  if (incoming.firstName) {
    editedUser.firstName = incoming.firstName;
  }
  if (incoming.lastName) {
    editedUser.lastName = incoming.lastName;
  }
  if (incoming.email) {
    editedUser.email = incoming.email;
  }
  if (incoming.role) {
    editedUser.role = incoming.role;
  }
  return editedUser;
}
