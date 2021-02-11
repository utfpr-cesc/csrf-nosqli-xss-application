function deleteUser(id) {
  output('Deleting...', 'info', `#delete-${id}`);
  fetch(`/users/${id}`, {
    "method": "DELETE",
    "headers": {
    }
  }).then(response => {
    if (response.status < 200 || response.status > 299) {
      throw response;
    }
    output('Deleted', 'success', `#delete-${id}`);
    document.querySelector(`#delete-${id}`).href = 'javascript: void(0);';
  }).catch(err => {
    output('Delete', 'danger', `#delete-${id}`);
  });
}

function register(form) {
  output('Registering...', 'info');
  fetch("/users", {
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
    output(`New user successfully registered! Refreshing users list...`, 'success');
    form.username.value = '';
    form.password.value = '';
    form.username.focus();
    response.json().then(user => {
      document.querySelector('ul').innerHTML += `
      <li>
        [ <a
          href="javascript: deleteUser('${user._id}'); void(0);"
          id="delete-${user._id}"
          class="danger"
        >Delete</a> ] ${user.username}
      </li>`;
    });
  }).catch(err => {
    output('Error registering new user. Please try again.', 'danger');
  });
  return false;
}
