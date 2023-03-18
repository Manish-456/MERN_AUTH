import styles from "../style/username.module.css";

import { toast, Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { resetPasswordVerify } from "../Helper/Validate";
import { resetPassword } from "../Helper/helper";
import { useAuthStore } from "../store/store";
import { Navigate, useNavigate } from "react-router-dom";
import useFetch from "../hooks/fetchhook";


interface FormValues {
  password: string;
  confirm_pwd: string;
}
const Reset = () => {
  const navigate = useNavigate();
  const { username } = useAuthStore((state) => state.auth);
   
  const initialValues: FormValues = {
    password: "",
    confirm_pwd: "",
  };

 const [{isLoading ,status ,serverError}] = useFetch('/createResetSession');


  const formik = useFormik({
    initialValues,
    validate: resetPasswordVerify,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values: FormValues) => {
      let resetPromise = resetPassword({ username, password: values.password });
      toast.promise(resetPromise, {
        loading: "Reseting",
        success: <b>Reset Successfully...!</b>,
        error: <b>Couldn't reset password..!</b>,
      });

      resetPromise
        .then(() => {
          navigate("/password");
        })
        .catch((err) => {
          toast.error("Couldn't reset Password");
        });
    },
  });

  if (isLoading) return <h1 className="text-2xl font-bold">Loading...</h1>;
  status && status !== 201 &&  <Navigate to={'/password'} replace={true} ></Navigate>
  
  if (serverError) return <h1 className="text-red-500 font-bold text-2xl text-center mt-20">{`${serverError}`}</h1>

  
  return (
    <main className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center  items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col  items-center">
            <h4 className="text-5xl font-bold">Reset Password!</h4>
            <span className="py-4 text-xl text-center w-2/3 text-gray-500">
              Enter new password
            </span>
          </div>
          <form className="py-20" onSubmit={formik.handleSubmit}>
            <div>
              <span></span>
            </div>
            <div className={` flex flex-col items-center gap-6`}>
              <input
                {...formik.getFieldProps("password")}
                type="text"
                className={styles.textbox}
                placeholder="New Password"
              />
              <input
                {...formik.getFieldProps("confirm_pwd")}
                type="text"
                className={styles.textbox}
                placeholder="Confirm Password"
              />
              <button
                className={`${styles.btn} bg-indigo-500 hover:bg-[#ff6a6a]`}
                type="submit"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Reset;
