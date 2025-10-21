import api from "../services/Axios";

// ------------------------------------------------------ Add College ----------------------------------------------------
export const AddCollegeHandler = (payload) => {
    const header = {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`,'Content-Type': 'multipart/form-data' }
    }
    return api.post('add-college', payload,header).then(response => response)
      .catch(err => err?.response);
  };
  export const EditCollegeHandler = (payload) => {
    const header = {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`,'Content-Type': 'multipart/form-data' }
    }
    return api.post('edit-college', payload,header).then(response => response)
      .catch(err => err?.response);
  };
  export const DeleteCollegeHandler = (payload) => {
    const header = {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`,'Content-Type': 'multipart/form-data' }
    }
    return api.post('delete-college', payload,header).then(response => response)
      .catch(err => err?.response);
  };
  // ------------------------------------------------- get College list ------------------------------------------------
  export const GetCollegeList = () => {
    const header = {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }
    return api.get('get-colleges', header).then(response => response)
      .catch(err => err?.response);
  };

  // ------------------------------------------------------- Stream ----------------------------------------------------------

export const AddStreamHandler = (payload) => {
  const header = {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`,'Content-Type': 'multipart/form-data' }
  }
  return api.post('add-stream', payload,header).then(response => response)
    .catch(err => err?.response);
};
export const EditStreamHandler = (payload) => {
  const header = {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`,'Content-Type': 'multipart/form-data' }
  }
  return api.post('edit-stream', payload,header).then(response => response)
    .catch(err => err?.response);
};
export const DeleteStreamHandler = (payload) => {
  const header = {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`,'Content-Type': 'multipart/form-data' }
  }
  return api.post('delete-stream', payload,header).then(response => response)
    .catch(err => err?.response);
};
export const GetStreamList = () => {
  const header = {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  }
  return api.get('get-streams', header).then(response => response)
    .catch(err => err?.response);
};

  // ------------------------------------------------------- Semester ----------------------------------------------------------

  export const AddSemesterHandler = (payload) => {
    const header = {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }
    return api.post('add-semester', payload,header).then(response => response)
      .catch(err => err?.response);
  };
  export const EditSemesterHandler = (payload) => {
    const header = {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }
    return api.post('edit-semester', payload,header).then(response => response)
      .catch(err => err?.response);
  };
  export const DeleteSemesterHandler = (payload) => {
    const header = {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }
    return api.post('delete-semester', payload,header).then(response => response)
      .catch(err => err?.response);
  };
  export const GetSemesterList = () => {
    const header = {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }
    return api.get('get-semesters', header).then(response => response)
      .catch(err => err?.response);
  };

    // ------------------------------------------------------- Course ----------------------------------------------------------

    export const AddCourseHandler = (payload) => {
      const header = {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }
      return api.post('add-course', payload,header).then(response => response)
        .catch(err => err?.response);
    };
    export const EditCourseHandler = (payload) => {
      const header = {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }
      return api.post('edit-course', payload,header).then(response => response)
        .catch(err => err?.response);
    };
    export const DeleteCourseHandler = (payload) => {
      const header = {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }
      return api.post('delete-course', payload,header).then(response => response)
        .catch(err => err?.response);
    };
    export const GetCourseList = () => {
      const header = {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }
      return api.get('get-courses', header).then(response => response)
        .catch(err => err?.response);
    };

        // ------------------------------------------------------- Logo ----------------------------------------------------------

        export const AddLogoHandler = (payload) => {
          const header = {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`,'Content-Type': 'multipart/form-data' }
          }
          return api.post('save-logo', payload,header).then(response => response)
            .catch(err => err?.response);
        };
        export const EditLogoHandler = (payload) => {
          const header = {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`,'Content-Type': 'multipart/form-data' }
          }
          return api.post('edit-logo', payload,header).then(response => response)
            .catch(err => err?.response);
        };
        export const DeleteLogoHandler = (payload) => {
          const header = {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }
          return api.post('delete-logo', payload,header).then(response => response)
            .catch(err => err?.response);
        };
        export const GetLogoList = () => {
          const header = {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }
          return api.get('get-company', header).then(response => response)
            .catch(err => err?.response);
        };