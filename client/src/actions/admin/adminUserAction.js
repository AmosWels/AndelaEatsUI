import axios from "axios";
import {
  GET_ADMIN_USER,
  GET_ALL_ADMIN_USERS,
  ADD_ADMIN_USER_SUCCESS,
  ADD_ADMIN_USER_FAILURE,
  IS_FETCHING_ADMIN_USERS,
  FETCH_USERS_ROLES,
  ADD_USER_ROLE_SUCCESS,
  ADD_USER_ROLE_FAILURE,
  DELETE_USER_ROLE_SUCCESS,
  EDIT_USER_ROLE_SUCCESS,
  DELETE_USER_PERMISION_SUCCESS,
  ADD_USER_PERMISION_SUCCESS,
  FETCH_USER_PERMISION_SUCCESS,
  IS_FETCHING_ROLE_PERMISION,
  IS_FETCHING_ROLES,
  FETCH_ALL_PERMISIONS,
  GET_TAPPED_USERS_SUCCESS,
  GET_TAPPED_USERS_FAILURE
} from "../actionTypes";
import token from '../../helpers/jwtDecode';
import { toastSuccess, toastError } from '../../helpers/toast';

export const userID = token().id;

export const setAdminUser = role => ({
  type: GET_ADMIN_USER,
  payload: role
});

export const fetchAdminUsers = adminUsers => ({
  type: GET_ALL_ADMIN_USERS,
  payload: adminUsers
});
const isFetchingAdmin = (payload) => ({
  type: IS_FETCHING_ADMIN_USERS,
  payload
});

export const fetchRoles = UserRoles => ({
  type: FETCH_USERS_ROLES,
  payload: UserRoles
});

export const fetchRolePermisions = RolePermision => ({
  type: FETCH_USER_PERMISION_SUCCESS,
  payload: RolePermision
});

export const fetchAllPermisions = Permisions => ({
  type: FETCH_ALL_PERMISIONS,
  payload: Permisions
});

const isFetchingRolePermision = (payload) => ({
  type: IS_FETCHING_ROLE_PERMISION,
  payload
});

const isFetchingRoles = (payload) => ({
  type: IS_FETCHING_ROLES,
  payload
});

export const addAdminUser = (message, type) => ({
  type,
  message
});

export const getAdminUser = () => dispatch => axios.get(`/roles/user/${userID}`)
  .then((response) => {
    dispatch(setAdminUser(response.data.payload.user_role[0].roleId));
  });

export const getAllAdminUsers = () => dispatch => {
  dispatch(isFetchingAdmin(true));
  return axios.get('/users/admin')
    .then((response) => {
      dispatch(fetchAdminUsers(response.data.payload.adminUsers));
      dispatch(isFetchingAdmin(false));
    })
    .catch(error => {
      dispatch(isFetchingAdmin(false));
    });
};

export const getRolePermisions = roleId => dispatch => {
  dispatch(isFetchingRolePermision(true));
  return axios.get(`roles/${roleId}/permissions`)
    .then((response) => {
      dispatch(fetchRolePermisions(response.data.payload.role_permissions));
      dispatch(isFetchingRolePermision(false));
    })
    .catch(error => {
      dispatch(isFetchingRolePermision(false));
    });
};

export const getAllPermisions = (adminId) => dispatch => {
  dispatch(isFetchingRolePermision(true));
  return axios.get(`roles/${adminId}/permissions`)
    .then((response) => {
      dispatch(fetchAllPermisions(response.data.payload.role_permissions));
      dispatch(isFetchingRolePermision(false));
    })
    .catch(error => {
      dispatch(isFetchingRolePermision(false));
    });
};

export const createAdminUser = (userData) => dispatch => axios.post(`/roles/user`, userData)
  .then((response) => {
    const { msg, payload } = response.data;
    toastSuccess("User role changed to Admin successfully");
    dispatch(addAdminUser(msg, ADD_ADMIN_USER_SUCCESS));
  })
  .catch((error) => {
    error = error.response ? error.response.data.msg : 'Invalid Email Address entered!';
    toastError(error);
    dispatch(addAdminUser(error, ADD_ADMIN_USER_FAILURE));
  });

export const addUserRole = (type, role) => ({
  type,
  payload: role
});

export const createUserPermisionSuccess = (type, permision) => ({
  type,
  payload: permision
});

export const deleteUserRoleSuccess = role => ({
  type: DELETE_USER_ROLE_SUCCESS,
  payload: role
});

export const editUserRoleSuccess = role => ({
  type: EDIT_USER_ROLE_SUCCESS,
  payload: role
});

export const deleteUserPermisionSuccess = permision => ({
  type: DELETE_USER_PERMISION_SUCCESS,
  payload: permision
});

export const getAllUserRoles = () => dispatch => {
  dispatch(isFetchingRoles(true));
  return axios.get('/roles/').then((response) => {
    dispatch(fetchRoles(response.data.payload.roles));
    dispatch(isFetchingRoles(false));
  }).catch(error => {
    dispatch(isFetchingRoles(false));
  });
};

export const createUserRole = (roleData) => dispatch => axios.post(`/roles/`, roleData)
  .then((response) => {
    const { payload: { role } } = response.data;
    toastSuccess("User role has been successfully added ");
    dispatch(addUserRole(ADD_USER_ROLE_SUCCESS, role));
  })
  .catch((error) => {
    error = error.response ? error.response.data.msg : 'Missing User Role';
    toastError(error);
    dispatch(addUserRole(error, ADD_USER_ROLE_FAILURE));
  });

export const deleteUserRole = (roleId) => dispatch => axios.delete(`/roles/${roleId}`)
  .then((response) => {
    toastSuccess(response.data.msg);
    dispatch(deleteUserRoleSuccess(roleId));
  }).catch((error) => {
    toastError(error.response.data.msg);
  });

export const editUserRole = (roleId, roleDetail) => dispatch => axios.patch(`/roles/${roleId}`, roleDetail)
  .then((response) => {
    toastSuccess(response.data.msg);
    dispatch(editUserRoleSuccess(response.data.payload.role));
  }).catch((error) => {
    toastError(error.response.data.msg);
  });

export const deleteUserPermision = (permisionId) => dispatch => axios.delete(`roles/permissions/${permisionId}`)
  .then((response) => {
    toastSuccess(response.data.msg);
    dispatch(deleteUserPermisionSuccess(permisionId));
  }).catch((error) => {
    toastError(error.response.data.msg);
  });

export const createUserPermision = (permissionData) => dispatch => axios.post(`roles/permissions`, permissionData)
  .then((response) => {
    const responseData = response ? response.data.msg : 'Not created, Please Contact Admin';
    toastSuccess(responseData);
    dispatch(createUserPermisionSuccess(responseData, ADD_USER_PERMISION_SUCCESS));
  }).catch((error) => {
    error = error.response ? error.response.data.msg : 'Not created, Please Contact Admin';
    toastError(error);
  });

export const getTappedUsersSucess = (tabbedUsers) => ({
  type: GET_TAPPED_USERS_SUCCESS,
  payload: tabbedUsers
});

export const getTappedUsersFailure = (error) => ({
  type: GET_TAPPED_USERS_FAILURE,
  payload: error,
});

export const getTappedUsers = (date = null) => (dispatch) => {
  const dateRange = date;
  const url = dateRange ? `reports/taps/daily/?dateRange=${dateRange.endDate}:${dateRange.startDate}` : 'reports/taps/daily';

  return axios.get(url)
    .then(response => {
      dispatch(getTappedUsersSucess(response.data.payload));
    })
    .catch((error) => {
      dispatch(getTappedUsersFailure(error.response.data));
    });
};
