export const getStoredMembers = () => {
  const data = localStorage.getItem('tamam_members');
  return data ? JSON.parse(data) : [];
};

export const saveMembers = (members) => {
  localStorage.setItem('tamam_members', JSON.stringify(members));
};

export const getStoredAttendance = () => {
  const data = localStorage.getItem('tamam_attendance');
  return data ? JSON.parse(data) : {};
};

export const saveAttendance = (attendance) => {
  localStorage.setItem('tamam_attendance', JSON.stringify(attendance));
};
