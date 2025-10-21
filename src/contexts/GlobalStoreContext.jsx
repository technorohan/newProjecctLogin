import React, { createContext, useReducer } from 'react';

const initialGlobalState = {

  customValue: "old value in global store",
  TOGGLE_TERM_CONDITION_MODAL: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    
    case 'ADDVALUE': {
      return {
        ...state,
        customValue: "demo value for global context"
      };
    }
    case 'MODAL_OFF': {
      console.log(action.payload)
      return {
        ...state,
        [action.payload]: false
      };
    }
    case 'TOGGLE_MODAL': {
      if (action.payload === 'TOGGLE_TERM_CONDITION_MODAL') {
        return {
          ...state,
          [action.payload]: !state.TOGGLE_TERM_CONDITION_MODAL,
        }
      }

    }
    default: {
      return { ...state };
    }
  }
};

const GlobalContext = createContext({
  ...initialGlobalState,
  addValMethod: () => { console.log('Add Value') },
  toggleForModal: () => { console.log('Modal') },
  offForModal: () => { console.log('Modal off') },

});
export const GlobalStoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialGlobalState);

  const addValMethod = (payload) => {
    dispatch({ type: 'ADDVALUE', payload: payload });
  };
  const toggleForModal = (payload) => {
    dispatch({ type: 'TOGGLE_MODAL', payload: payload });
  };
  const offForModal = (payload) => {
    dispatch({ type: 'MODAL_OFF', payload: payload });
  };

  return (
    <GlobalContext.Provider
      value={{
        ...state,
        addValMethod,
        toggleForModal,
        offForModal
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
