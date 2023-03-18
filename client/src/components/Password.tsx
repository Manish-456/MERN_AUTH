import styles from "../style/username.module.css";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { FormValues, passwordValidate } from "../Helper/Validate";
import useFetch from "../hooks/fetchhook";
import { useAuthStore } from "../store/store";
import { verifyPassword } from "../Helper/helper";

const Password = () => {
  const initialValues: FormValues = {
    password: "",
  };
  const navigate = useNavigate();
  const { username } = useAuthStore((state) => state.auth);
  
  const [{ isLoading, serverError, apiData }] = useFetch(`/user/${username}`);

  const formik = useFormik({
    initialValues,
    validate: passwordValidate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values: FormValues) => {
      let loginPromise = verifyPassword({
        username,
        password: values.password,
      });
      toast.promise(loginPromise, {
        loading: "Checking",
        success: <b>Login Successfully...</b>,
        error: <b>Password Not Match</b>,
      });
      loginPromise.then((res) => {
       const token = res?.data.token 
       token && localStorage.setItem("token",token);
        navigate("/profile");
      });
    },
  });
  
   
  if (isLoading) return <h1 className="text-2xl font-bold">Loading...</h1>;
  if (serverError)
    return (
      <h1 className="text-red-500 font-bold text-2xl text-center mt-20">{`${serverError}`}</h1>
    );
  return (
    <main className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center  items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col  items-center">
            <h4 className="text-3xl font-bold">
              Hello {apiData?.username || apiData?.firstName || username}
            </h4>
            <span className="py-4 text-lg text-center w-2/3 text-gray-500">
              Explore more by connecting with us
            </span>
          </div>
          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="flex justify-center py-4">
              <img
                src={apiData?.profile || "img/noprofile.png"}
                className={styles.profile_img}
                alt="avatar"
              />
            </div>
            <div className={` flex flex-col items-center gap-6`}>
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
                Sign Up
              </button>
            </div>
            <div className="text-center py-4">
              <span className="text-gray-500">
                Forgot Password ?
                <Link className="text-red-500 font-semibold" to="/recovery">
                  Recovery Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Password;
