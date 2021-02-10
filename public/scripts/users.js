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
