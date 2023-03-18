import { useState } from "react";
import styles from "../style/username.module.css";
import {  useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import convertToBase64 from "../Helper/convert";
import extend from '../style/Profile.module.css'
import { FormValues, profileValidation } from "../Helper/Validate";

import useFetch from "../hooks/fetchhook";
import { updateUser } from "../Helper/helper";


const Profile = () => {
    const navigate = useNavigate();
  const [file, setFile] = useState<string>();



const [{ isLoading, serverError, apiData }] = useFetch('');
  const initialValues  = {
    firstName : apiData?.firstName,
    profile : apiData?.profile,
    mobile : apiData?.mobile,
    email : apiData?.email,
    address : apiData?.address,
    lastName : apiData?.lastName
  }

  
  const formik = useFormik({
    initialValues,
    validate: profileValidation,
    enableReinitialize : true,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values: FormValues) => {
     let updatePromise =  updateUser({ ...values, profile: file || apiData?.profile });
     toast.promise(updatePromise, {
      loading : "Updating...!",
      success : <b>Updated Successfully...!</b>,
      error : <b>Could not update!</b>
     })
    },
  });
  
  
  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    try {
      const base64 = await convertToBase64(file);
      setFile(base64);
    } catch (error) {
    
    }
  };
  function handleLogout(){
    localStorage.removeItem('token');
    navigate('/')
  }
  if (isLoading) return <h1 className="text-2xl font-bold">Loading...</h1>;
  if (serverError) return <h1 className="text-red-500 font-bold text-2xl text-center mt-20">{`${serverError}`}</h1>
  
  return (
    <main className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center  items-center h-screen">
        <div className={`${styles.glass} mt-20 md:mt-0 ${extend.glass} w-[45%]`}>
          <div className="title flex flex-col  items-center ">
            <h4 className="md:text-5xl text-2xl font-bold">Profile</h4>
            <span className="py-4 text-lg md:text-xl text-center w-2/3 text-gray-500">
              You can update your profile.
            </span>
          </div>
          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="flex  justify-center py-4">
              <label htmlFor="profile">
                <img
                  src={apiData?.profile || file ||  "img/noprofile.png"}
                  className={`${styles.profile_img} ${extend.profile_img}`}
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
            <div className={` flex flex-col items-center md:gap-6 gap-4`}>
              <div className="name flex md:flex-row flex-col w-3/4 md:gap-10 gap-4">
              <input
                {...formik.getFieldProps("firstName")}
                type="text"
                className={`${styles.textbox} ${extend.textbox}`}
                placeholder="FirstName"
              />
                <input
                {...formik.getFieldProps("lastName")}
                type="text"
                className={`${styles.textbox} ${extend.textbox}`}
                placeholder="LastName"
              />
              </div>
              <div className="name  flex md:flex-row flex-col w-3/4 md:gap-10 gap-4">
              <input
                {...formik.getFieldProps("mobile")}
                type="text"
                className={`${styles.textbox} ${extend.textbox}`}
                placeholder="Mobile No."
              />
                <input
                {...formik.getFieldProps("email")}
                type="text"
                className={`${styles.textbox} ${extend.textbox}`}
                placeholder="Email*"
              />
              </div>
      
              <input
                {...formik.getFieldProps("address")}
                type="text"
                className={`${styles.textbox} ${extend.textbox}`}
                placeholder="Address"
              />
                 <button
                className={`${styles.btn} bg-indigo-500 hover:bg-[#ff6a6a]`}
                type="submit"
              >
                Update
              </button>
       
             
       
            </div>
            <div className="text-center py-4">
              <span className="text-gray-500">
             come back later?
                <button onClick={handleLogout} className="text-red-500 font-semibold" >
                 logout
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Profile;
