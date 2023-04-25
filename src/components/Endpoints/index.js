import Cookies from 'js-cookie';
import { ENDPOINT_NOTE_EDIT, ENDPOINT_NOTE_DELETE, ENDPOINT_NOTES } from './urls';

function doGET({ onSuccess, onError, url }) {
  fetch(url)
  .then((res) => res.json())
  .then((newData) => {
    onSuccess(newData);
  })
  .catch((e) => {
    onError(e.toString());
  });
}

function doPOST({ onSuccess, onError, url, formData = null }) {
  const requestOptions = {
    method: 'POST',
    headers: {
      'X-CSRFToken': Cookies.get('csrftoken')
    },
    body: formData
  };

  let isError = false;

  fetch(url, requestOptions)
    .then((res) => {
      if(res.status >= 400) {
        isError = true;
      }
      return res.json();
    })
    .then((data) => {
      // Stop if we are reporting an error
      if (isError) {
        onError(data.message);
      }

      else{
        onSuccess(data);
      }
    })
    .catch((e) => {
      onError(onError(e));
    });
}

export function editNote({ onSuccess, onError, title, text, work, reference, noteId = null, beForgiving = false }) {

  const formData = new FormData();
  formData.append("title", title);
  formData.append("text", text);

  if (work) {
    formData.append("work", work);
  }

  if (reference) {
    formData.append("division", reference);
  }

  doPOST({ onSuccess, onError, formData, url: ENDPOINT_NOTE_EDIT(noteId, beForgiving) });
}

export function deleteNote({ onSuccess, onError, noteId }) {
  doPOST({ onSuccess, onError, url: ENDPOINT_NOTE_DELETE(noteId) });
};

export function getNotes({ onSuccess, onError, search = null, work = null, division = null, includeRelated = false }) {
  doGET({
    url: ENDPOINT_NOTES(work, division, search, includeRelated),
    onSuccess,
    onError
  });
}
