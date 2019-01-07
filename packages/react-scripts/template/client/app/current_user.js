let CurrentUser;

if (typeof window !== 'undefined') {
  CurrentUser = JSON.parse(localStorage.getItem('auth0_profile'));
} else {
  CurrentUser = {};
}

export default CurrentUser;
