import { toast } from "react-hot-toast";
import { authentication} from "./helper";

export interface FormValues {
  username?: string;
  password?: string;
  email?: string;
  profile?: string;
  firstname?: string;
  lastname?: string;
  exist?: string;
}

interface ResetPartial extends FormValues {
  confirm_pwd: string;
}

const toastError = (message: string): string => {
  return toast.error(message);
};

/** Validate username */
export const usernameVerify = (
  error: FormValues,
  values: FormValues
): FormValues => {
  if (!values.username) {
    error.username = toastError("Username Required...!");
  } else if (values.username.includes(" ")) {
    error.username = toastError("Invalid Username");
  }
  return error;
};

/** validate login page username*/
export const usernameValidate = async (
  values: FormValues
): Promise<FormValues | FormValues> => {
  const errors = usernameVerify({} as FormValues, values);
  if (values.username) {
    // check user FormValues or not
    const data = await authentication(values.username);
    if ("error" in data) {
      errors.exist = toastError("User doesnot exist");
    }
  }
  return errors;
};

export const passwordVerify = (
  error: FormValues,
  values: FormValues
): FormValues => {
  const specialChar: RegExp = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

  if (!values.password) {
    error.password = toastError("Password Required..!");
  } else if (values.password.includes(" ")) {
    error.password = toastError("Password must not contain any whitespace");
  } else if (values.password.length < 4) {
    error.password = toastError("Password must contain more than 4 characters");
  } else if (!specialChar.test(values.password)) {
    error.password = toastError("Password must have special characters");
  }
  return error;
};

export const passwordValidate = async (
  values: FormValues
): Promise<FormValues> => {
  const errors = passwordVerify({} as FormValues, values);

  return errors;
};

/**************Reset Password validate****************** */
export const resetPasswordValidate = (
  errors: FormValues,
  values: Partial<ResetPartial>
): FormValues => {
  if (values.password !== values.confirm_pwd) {
    errors.exist = toastError("password does not match");
  } else if (values.password?.includes(" ")) {
    errors.exist = toastError("Password must not contain any whitespace");
  } else if (values.password && values.password?.length < 4) {
    errors.exist = toastError("password must contain atleast 4 characters");
  }
  return errors;
};
export const resetPasswordVerify = async (
  values: Partial<ResetPartial>
): Promise<FormValues> => {
  const errors = resetPasswordValidate({} as FormValues, values);
  return errors;
};

export async function registerValidation(values: FormValues) {
  const errors = usernameVerify({} as FormValues, values);
  passwordVerify(errors as FormValues, values);
  emailVerify(errors, values);
}

export const emailVerify = (
  error: FormValues,
  values: FormValues
): FormValues => {
  const emailReg: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!values.email) {
    error.email = toastError("Email Required..!");
  } else if (values.email.includes(" ")) {
    error.email = toastError("Email must not contain any whitespace...!");
  } else if (!emailReg.test(values.email)) {
    error.email = toastError("Invalid email address");
  }
  return error;
};

export async function profileValidation(
  values: FormValues
): Promise<FormValues> {
  const errors = emailVerify({} as FormValues, values);
  return errors;
}
