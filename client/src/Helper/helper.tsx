import axios, { AxiosResponse } from "axios";
import jwtDecode from "jwt-decode";
/** Make API Request */

/** authenticate function */

axios.defaults.baseURL = "http://localhost:8080";

interface ResponseError {
  error: string;
}

export interface UserData {
  username?: string;
  email?: string;
  password?: string;
  profile?: string;
  firstName?: string;
  lastName?: string;
  mobile?: String;
  address?: String;
}

export interface Data {
  data: {
    msg: string;
    username?: string;
    token?: string;
    code?: number;
  };
  status?: number;
}
export interface DecodedValue {
  username : string,
  userId : string,
  iat : number,
  exp : number
}
export const getUsername = async () : Promise<DecodedValue> => {
  const token = localStorage.getItem("token");
  if (!token) return Promise.reject("Cannot find token");
  let decode : DecodedValue = jwtDecode(token);
  return decode;
};

export const authentication = async (
  username: string
): Promise<ResponseError | Data> => {
  try {
    return await axios.post("/api/authenticate", { username });
  } catch (err) {
    return { error: "Username doesn't exist...!" };
  }
};

export const getUser = async ({
  username,
}: {
  username: string;
}): Promise<UserData | ResponseError> => {
  try {
    const { data }: AxiosResponse<UserData, null> = await axios.get(
      `/api/user/${username}`
    );
    return data;
  } catch (err) {
    return { error: "Password doesnot match" };
  }
};

export const registerUser = async (
  credentials: UserData
): Promise<string | unknown> => {
  try {
    const {
      data: { msg },
      status,
    }: Data = await axios.post(`/api/register`, credentials);
    let { username, email } = credentials;
    /** send email */
    if (status === 201) {
      await axios.post("/api/registerMail", { username, email, text: msg });
      return Promise.resolve(msg);
    } else {
      return Promise.reject(new Error("Registration failed."));
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

/**Login function */

export const verifyPassword = async ({ username, password }: UserData) => {
  try {
    if (username) {
      const { data }: Data = await axios.post("/api/login", {
        username,
        password,
      });
      return Promise.resolve({ data });
    }
  } catch (error) {
    return Promise.reject({ error: "Password doesn't match" });
  }
};

/** update user function */
export const updateUser = async (response: UserData) => {
  try {
    const token = localStorage.getItem("token");
    const data: Data = await axios.put(`/api/updateUser`, response, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return Promise.resolve({ data });
  } catch (err) {
    return Promise.reject({ error: "Could not update" });
  }
};

export const generateOTP = async (username: string) => {
  try {
    const {
      data: { code },
      status,
    }: Data = await axios.get(`/api/generateOTP?username=${username}`);
    if (status === 201) {
      let data = await getUser({ username });
      if ("error" in data) {
        Promise.reject({ error: "something went wrong..." });
      } else {
        const { email } = data;
        let text = `Your Password Recovery OTP is ${code}. Verify and recover your password`;
        await axios.post(`/api/registerMail`, {
          username,
          email,
          text,
          subject: "Password Recovery OTP",
        });
      }
    }
    return Promise.resolve(code);
  } catch (err) {
    return Promise.reject({ err });
  }
};

/** Verify OTP */
export const verifyOTP = async ({
  username,
  code,
}: Data["data"]): Promise<Data | ResponseError> => {
  try {
    const { data, status }: Data = await axios.get(
      `/api/verifyOTP?username=${username}&code=${code}`
    );
    return { data, status };
  } catch (err) {
    return Promise.reject({ error: "Something went wrong" });
  }
};

export const resetPassword = async ({ username, password }: UserData) => {
  try {
    const { data, status }: Data = await axios.put(`/api/resetPassword`, {
      username,
      password,
    });
    return Promise.resolve({ data, status });
  } catch (error) {
    Promise.reject({ error });
  }
};
