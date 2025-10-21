export const handelError = (error, setFormData) => {
  const errors = error.issues;
  console.error(errors);

  errors.length > 0 &&
    errors.forEach((error) => {
      if (error.message !== "") {
        const field = error.path[0] + "Err";

        setFormData((_prevState) => ({
          ..._prevState,
          [field]: true,
          [`${field}Msg`]: error.message,
        }));
      }
    });
};

