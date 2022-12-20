// This file contains all the errors that can be thrown in the app.

//This enum contains all the types of errors that can be thrown in the app.
//The categories help us to determine how to handle the error, by knowing roughly where it came from.
enum ErrorType {
  APIResponse = "API response",
  Internal = "internal",
  Input = "input",
}

//This is the base class for all errors in the app
class ErrorInstance {
  type: ErrorType;
  message: string;

  constructor(type: ErrorType, message: string) {
    this.type = type;
    this.message = message;
  }

  text() {
    return `${this.type} error: ${this.message}`;
  }
}

//This is a generic error for when the user enters invalid input
function userErrInstance(message: string) {
  return new ErrorInstance(ErrorType.Input, message);
}

//This is a generic error for when the API returns an error response
function internalErrInstance(message: string) {
  return new ErrorInstance(ErrorType.Internal, message);
}

//This is a generic error for when the API returns an error response
function apiResponseErrInstance(message: string) {
  return new ErrorInstance(ErrorType.APIResponse, message);
}

export const Errors = {
  //API RESPONSE ERRORS
  //INTERNAL ERRORS
  //USER ERRORS
  postFormData: {
    //From ClubView.vue form poster function
    invalidFirstName: userErrInstance("Invalid first name"),
    invalidLastName: userErrInstance("Invalid last name"),
    invalidGrade: userErrInstance("The grade field must be between 5 and 12. If the entriant is a staff member, please leave this field blank."),
    invalidEmail: userErrInstance("Invalid email"),
    alreadyExists: userErrInstance("Pathfinder already exists"),
  },
};
//Note: the Errors object will only contain two levels of keys.
//The first level will be the name of the function that threw the error.
//The second level will be the name of the error that was thrown.


//catch throw events in the app
window.addEventListener("error", (event) => {
  if (event.error.type) {
    console.log(event.error.text());
  } else {
    //there is no official error for this case because of two reasons:
    //1. Any errors that do not have a type are probably syntax or version errors, which are assumed not to exist in the app bc of DependaBot and testing.
    //2. this is an anonymous catch-all for any errors that do not have a type, which should not exist in the app, so it can't be assigned a case.
    console.log(
      internalErrInstance("An error with an invalid type was thrown.")
    );
  }
});

