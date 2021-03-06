let auth0 = null;

const fetchAuthConfig = () => fetch('/auth_config.json');

const configureClient = async () => {
  const response = await fetchAuthConfig();
  const config = await response.json();

  auth0 = await createAuth0Client({
    domain: config.domain,
    client_id: config.clientId
  });
};

window.onload = async () => {
  await configureClient();

  updateUI();

  const isAuthenticated = await auth0.isAuthenticated();

  if (isAuthenticated) {
    console.log(isAuthenticated);
    console.log('Is supposed to be true');
    document.getElementById("gated-content").classList.remove("hidden");

    document.getElementById(
      "ipt-access-token"
    ).innerHTML = await auth0.getTokenSilently();

    document.getElementById("ipt-user-profile").innerHTML = JSON.stringify(
      await auth0.getUser()
    );

  } else {
    console.log(isAuthenticated);
    console.log("Is supposed to be false");
    document.getElementById("gated-content").classList.add("hidden");
  }
};

const login = async () => {
  await auth0.loginWithRedirect({
    redirect_uri: window.location.origin
  });
};

const logout = () => {
  console.log('You are pressing logout');
  auth0.logout({
    returnTo: window.location.origin
  });
};

const query = window.location.search;
if(query.includes('code=') && query.includes('state=')){

  // Process login state
  auth0.handleRedirectCallback(); // <- Err: Await is only valid in async function

  updateUI();

  // Use replaceState to redirect the user away and remove the query string parameters
  window.history.replaceState({}, document.title, '/');
};

const updateUI = async () => {
  const isAuthenticated = await auth0.isAuthenticated();
  console.log(isAuthenticated);
};
