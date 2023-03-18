import { useState } from "react";
import styles from "../style/username.module.css";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import convertToBase64 from "../Helper/convert";
import { FormValues, registerValidation } from "../Helper/Validate";
import { registerUser } from "../Helper/helper";
import extend from '../style/Profile.module.css'

const Register = () => {
  const [file, setFile] = useState<string>();
  const initialValues: FormValues = {};
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues,
    validate: registerValidation,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values: FormValues) => {
      values = { ...values, profile: file };
      let registerPromise = registerUser(values);
      toast.promise(registerPromise, {
        loading: "Creating...",
        success: <strong>Register Successful</strong>,
        error: <strong>Could not register</strong>,
      });
      registerPromise.then(() => navigate("/"));
    },
  });

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    try {
      const base64 = await convertToBase64(file);
      setFile(base64);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center  items-center h-screen">
        <div className={`${styles.glass} ${extend.glass} w-[45%]`}>
          <div className="title flex flex-col  items-center">
            <h4 className="md:text-5xl text-3xl font-bold">Register</h4>
            <span className="py-4 text-xl text-center w-2/3 text-gray-500">
              Happy to join you!
            </span>
          </div>
          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="flex justify-center py-4">
              <label htmlFor="profile">
                <img
                  src={file || "img/noprofile.png"}
                  className={styles.profile_img}
                  alt="avatar"
                />
              </label>
              <input
                onChange={upload}
                style={{ display: "none" }}
                type="file"
                name="profile"
                id="profile"
              />
            </div>
            <div className={` flex flex-col items-center gap-6`}>
              <input
                {...formik.getFieldProps("username")}
                type="text"
                className={styles.textbox}
                placeholder="username"
              />
              <input
                {...formik.getFieldProps("email")}
                type="text"
                className={styles.textbox}
                placeholder="email"
              />
              <input
                {...formik.getFieldProps("password")}
                type="text"
                className={styles.textbox}
                placeholder="Password"
              />
              <button
                className={`${styles.btn} bg-indigo-500 hover:bg-[#ff6a6a]`}
                type="submit"
              >
                Register
              </button>
            </div>
            <div className="text-center py-4">
              <span className="text-gray-500">
                Already Registered?  <Link className="text-red-500 font-semibold" to="/">
                  Signin
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Register;
