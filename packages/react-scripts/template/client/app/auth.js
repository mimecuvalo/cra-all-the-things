import Auth0Lock from 'auth0-lock';
import configuration from '../app/configuration';

const STORAGE_ID_TOKEN = 'auth0_idToken';
const STORAGE_ACCESS_TOKEN = 'auth0_accessToken';
const STORAGE_PROFILE = 'auth0_profile';

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

export function addAuth(obj) {
  const idToken = localStorage.getItem(STORAGE_ID_TOKEN);
  if (idToken) {
    obj['Authorization'] = `Bearer ${idToken}`;
  }

  return obj;
}

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

export function setUser(userObjOrUndefined, appCallback) {
  if (!userObjOrUndefined) {
    removeLogin();
  } else {
    saveLogin(userObjOrUndefined);
  }

  appCallback(getUser());
}

export function isLoggedIn() {
  return !!localStorage.getItem(STORAGE_ID_TOKEN);
}

function saveLogin({ authResult, profile }) {
  localStorage.setItem(STORAGE_ID_TOKEN, authResult.idToken);
  localStorage.setItem(STORAGE_ACCESS_TOKEN, authResult.accessToken);
  localStorage.setItem(STORAGE_PROFILE, JSON.stringify(profile));
}

function removeLogin() {
  localStorage.removeItem(STORAGE_ID_TOKEN);
  localStorage.removeItem(STORAGE_ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_PROFILE);
}
