import Cookies from 'js-cookie';
import { ENDPOINT_NOTE_EDIT } from './urls';

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

  const requestOptions = {
    method: 'POST',
    headers: {
      'X-CSRFToken': Cookies.get('csrftoken')
    },
    body: formData
  };

  let isError = false;

  fetch(ENDPOINT_NOTE_EDIT(noteId, beForgiving), requestOptions)
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


export function deleteNote({ onSuccess, onError, noteId }) {

};
