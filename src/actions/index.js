import axios from 'axios';

export const FETCH_DATA = 'FETCH_DATA';

const ROOT_URL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

export function fetchData() {

  const request = axios.get(ROOT_URL);

  return (dispatch) => {
    request.then(({ data }) => {
      dispatch({
        type: FETCH_DATA,
        payload: data
      });
    });
  }
}
