import api from "../helpers/ConfigHelper";

export const getMyProfile = async () => {
  return await api.get(`/user/get-my-profile`);
};

export const register = async (registerData) => {
  return await api.post(`/user`, registerData, {headers: {"Content-Type":"multipart/form-data"}});
};

export const update = async (updateData) => {
  return await api.put(`/user`, updateData, {headers: {"Content-Type":"multipart/form-data"}});
};

export const acceptVerification = async (id) => {
  return await api.put(`/user/accept-verification/`+ id);
};

export const denyVerification = async (id) => {
  return await api.put(`/user/deny-verification/` + id);
};

export const getAllSalesmans = async () => {
  return await api.get(`/user/get-all-salesmans`);
};
