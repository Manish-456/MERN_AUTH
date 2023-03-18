
import { Link, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { usernameValidate } from "../Helper/Validate";
import { useAuthStore } from "../store/store";

interface FormValues {
  username: string;
}
const Username = () => {
  const navigate = useNavigate();
  const setUsername = useAuthStore((state) => state.setUsername);
  // const username = useAuthStore((state) => state.auth.username);

  const initialValues: FormValues = {
    username: "",
  };

  const formik = useFormik({
    initialValues,
    validate: usernameValidate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values: FormValues) => {
      setUsername(values.username);
      navigate("/password")
    },
  });

  return (
    <main className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center  items-center h-screen">
        <div className={"glass"}>
          <div className="title flex flex-col  items-center">
            <h4 className="text-3xl font-bold">Hello !</h4>
            <span className="py-4 text-lg text-center w-2/3 text-gray-500">
              Explore more by connecting with us
            </span>
          </div>
          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="flex justify-center py-4">
              <img
                src="img/noprofile.png"
                className={"profile_img"}
                alt="avatar"
              />
            </div>
            <div className={` flex flex-col items-center gap-6`}>
              <input
                {...formik.getFieldProps("username")}
                type="text"
                spellCheck={true}
                className={"textbox"}
                placeholder="Username"
              />
              <button
                className={`btn bg-indigo-500 hover:bg-[#ff6a6a]`}
                type="submit"
              >
                Let's Go
              </button>
            </div>
            <div className="text-center py-4">
              <span className="text-gray-500">
                Not a Member{" "}
                <Link className="text-red-500 font-semibold" to="/register">
                  Register Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Username;
