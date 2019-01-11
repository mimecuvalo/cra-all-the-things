import Auth0Lock from 'auth0-lock';
import configuration from '../app/configuration';

const STORAGE_ID_TOKEN = 'auth0_idToken';
const STORAGE_ACCESS_TOKEN = 'auth0_accessToken';
const STORAGE_PROFILE = 'auth0_profile';

// Sets up the Auth0 object to be used later to create a login window.
export function createLock() {
  return new Auth0Lock(configuration.auth0_client_id, configuration.auth0_domain, {
    auth: {
      redirectUrl: `${window.location.protocol}//${window.location.host}/auth0-callback?next=${window.location.href}`,
      responseType: 'token id_token',
      params: {
        scope: 'openid profile email',
      },
    },
  });
}

// Appends the Authorization (with Bearer and token to an outgoing HTTP headers object).
export function addAuth(obj) {
  const idToken = localStorage.getItem(STORAGE_ID_TOKEN);
  if (idToken) {
    obj['Authorization'] = `Bearer ${idToken}`;
  }

  return obj;
}

// Retrieves the current user object.
export function getUser() {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const profile = localStorage.getItem(STORAGE_PROFILE);
  if (profile) {
    return JSON.parse(profile);
  }

  return undefined;
}

// Wrapper function to saveLogin/removeLogin that sets the user object appropriately.
// Once set, it will execute the callback with user info.
export function setUser(userObjOrUndefined, appCallback) {
  if (!userObjOrUndefined) {
    removeLogin();
  } else {
    saveLogin(userObjOrUndefined);
  }

  appCallback(getUser());
}

// Whether the user is logged in.
export function isLoggedIn() {
  return !!localStorage.getItem(STORAGE_ID_TOKEN);
}

// Internal function to this file to save the user information.
function saveLogin({ authResult, profile }) {
  localStorage.setItem(STORAGE_ID_TOKEN, authResult.idToken);
  localStorage.setItem(STORAGE_ACCESS_TOKEN, authResult.accessToken);
  localStorage.setItem(STORAGE_PROFILE, JSON.stringify(profile));
}

// Internal function to this file to remove the user information.
function removeLogin() {
  localStorage.removeItem(STORAGE_ID_TOKEN);
  localStorage.removeItem(STORAGE_ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_PROFILE);
}
