function signIn(form) {
  output('Logging in...', 'info');
  fetch("/auth/login", {
    "method": "POST",
    "body": JSON.stringify({
      username: form.username.value,
      password: form.password.value,
    }),
    "headers": {
      "Content-Type": "application/json",
    }
  }).then(response => {
    if (response.status < 200 || response.status > 299) {
      throw response;
    }
    output('Success! Redirecting...', 'success');
    location.href = '/users/list';
  }).catch(err => {
    output('Error logging in. Verify your username and password, then try again.', 'danger');
  });
  return false;
}

function signOut() {
  output('Logging out...', 'info', '#logout');
  fetch("/auth/logout", {
    "method": "POST",
    "headers": {
    }
  })
  .then(response => {
    if (response.status < 200 || response.status > 299) {
      throw response;
    }
    output('Success! Redirecting...', 'success', '#logout');
    location.href = '/login';
  })
  .catch(err => {
    output('Error logging out', 'danger', '#logout');
  });
}
