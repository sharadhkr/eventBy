import adminAxios from "./api";

export const fetchOrganisers = () =>
  adminAxios.get("/organisers");

export const toggleStatus = (id) =>
  adminAxios.patch(`/organisers/${id}/status`);

export const toggleVerification = (id) =>
  adminAxios.patch(`/organisers/${id}/verify`);
