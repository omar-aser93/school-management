"use client";

import { useForm } from "react-hook-form";     //using "react-hook-form" gives better performance & simplicity for complex forms
import { zodResolver } from "@hookform/resolvers/zod";
import { teacherSchema , TeacherSchemaType } from "@/lib/formsValidation";
import { createTeacher, updateTeacher } from "@/lib/actions/teacher.actions";
import { useFormState } from "react-dom";
import { useEffect, Dispatch, SetStateAction, useTransition, useState } from "react";   //Dispatch, SetStateAction used for Typescript type of setopen() prop
import { toast } from "react-toastify";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";


/* This form component will be used for both "create teacher" & "update teacher", We receive a type prop (create/update) & change server_action and text by it, 
  also a data prop but only for the update form to set inputs defaultValues, a setOpen prop to close the modal after submit, a relatedData prop (needed data from related DB models)  */
const TeacherForm = ({ type, data, setOpen, relatedData}: {type: "create" | "update";  data?: any;  setOpen: Dispatch<SetStateAction<boolean>>;  relatedData?: any;}) => {
  
  //using useForm() hook to handle the form & the inputs, we pass (Zod Schema) to the zodResolver of "react-hook-form" 
  const { register, handleSubmit, formState: { errors } } = useForm<TeacherSchemaType>({ resolver: zodResolver(teacherSchema) });
  
  const [img, setImg] = useState<any>();    //state to store user cloudinary_image, will pass it to server_action alongside other ...inputs_data

  //useFormState/useActionState is a modern react hook used to update a state value based on server action result [in this case, the state named state & the action named formAction & we pass (createTeacher/updateTeacher -> the server_action , {success: false, error: false} -> state default value)] 
  const [state, formAction] = useFormState( type === "create" ? createTeacher : updateTeacher, {success: false, error: false});
  const [isPending, startTransition] = useTransition();      //replacement to useFormStatus(), because it doesn't work with "react-hook-form", not needed with useActionState() in the future

  //if useFormState() -> {succes:true}, Show succes toast & close the modal 
  useEffect(() => {
    if (state.success) {
      toast(`Teacher has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);      
    }
  }, [state, type, setOpen]);

 
  return (
    //passing "react-hook-form" handleSubmit function, we'll use the server_action but after we pass it to useFormState() hook, to get success/error message
    <form className="flex flex-col gap-8" onSubmit={handleSubmit((data) => { startTransition(() => {formAction({ ...data, img: img?.secure_url })}) })}>
      <h1 className="text-xl font-semibold">{type === "create" ? "Create a new teacher" : "Update the teacher"}</h1>
      <span className="text-xs text-gray-400 font-medium"> Authentication Information </span>
      <div className="flex justify-between flex-wrap gap-4">          

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Username</label>
          <input type="text" {...register("username")} defaultValue={data?.username} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" />
          {errors?.username?.message && ( <p className="text-xs text-red-400">{errors?.username.message.toString()}</p> )}
        </div>
        
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Email</label>
          <input type="email" {...register("email")} defaultValue={data?.email} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" />
          {errors?.email?.message && ( <p className="text-xs text-red-400">{errors?.email.message.toString()}</p> )}
        </div>
        
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Password</label>
          <input type="password" {...register("password")} defaultValue={data?.password} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" />
          {errors?.password?.message && ( <p className="text-xs text-red-400">{errors?.password.message.toString()}</p> )}
        </div>        
      </div>

      <span className="text-xs text-gray-400 font-medium"> Personal Information </span>
        <div className="flex justify-between flex-wrap gap-4">
          <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">First Name</label>
          <input type="text" {...register("name")} defaultValue={data?.firstName} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" />
          {errors.name?.message && ( <p className="text-xs text-red-400">{errors.name.message.toString()}</p> )}
        </div>
        
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Last Name</label>
          <input type="text" {...register("surname")} defaultValue={data?.lastName} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" />
          {errors.surname?.message && ( <p className="text-xs text-red-400">{errors.surname.message.toString()}</p> )}
        </div>
        
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Phone</label>
          <input type="text" {...register("phone")}  defaultValue={data?.phone} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" />
          {errors.phone?.message && ( <p className="text-xs text-red-400">{errors.phone.message.toString()}</p> )}
        </div>
        
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Address</label>
          <input type="text" {...register("address")} defaultValue={data?.address} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" />
          {errors.address?.message && ( <p className="text-xs text-red-400">{errors.address.message.toString()}</p> )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Blood Type</label>
          <input type="text" {...register("bloodType")} defaultValue={data?.bloodType} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" />
          {errors.bloodType?.message && ( <p className="text-xs text-red-400">{errors.bloodType.message.toString()}</p> )}
        </div>        
        
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Birthday</label>
          <input type="date" {...register("birthday")} defaultValue={data?.birthday} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" />
          {errors.birthday?.message && ( <p className="text-xs text-red-400">{errors.birthday.message.toString()}</p> )}
        </div>
        
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Sex</label>
          <select {...register("sex")} defaultValue={data?.sex} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.sex?.message && (<p className="text-xs text-red-400"> {errors.sex.message.toString()} </p>)}
        </div>

        {/* getting subjects from relatedData prop & mapping through it, to choose teacher_subjects inside the form */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Subjects</label>
          <select multiple {...register("subjects")} defaultValue={data?.subjects} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" >
            {relatedData?.subjects.map((subject: { id: number; name: string }) => (
              <option value={subject.id} key={subject.id}> {subject.name} </option>
            ))}
          </select>
          {errors.subjects?.message && (<p className="text-xs text-red-400"> {errors.subjects.message.toString()} </p>)}
        </div>

        {/* Cloudinary Widget to upload user image */}    
        <CldUploadWidget uploadPreset="school" onSuccess={(result, { widget }) => { setImg(result.info); widget.close(); }} >
          {({ open }) => {
            return (
              <div className="flex flex-col justify-center items-center gap-5"> 
                <div className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer" onClick={() => open()} >
                  <Image src="/upload.png" alt="" width={28} height={28} />
                  <span>Upload a photo</span>
                </div>
                <img src={img?.secure_url} alt="user" width={100}/>
              </div>
            );
          }}
        </CldUploadWidget>

        {/* Sending the id in a hidden input, used in (update & delete) server_action */}
        {data && (
          <div className="flex flex-col gap-2 w-full md:w-1/4" hidden>
            <label className="text-xs text-gray-500">Id</label>
            <input type="text" {...register("id")} defaultValue={data?.id} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" />
            {errors?.id?.message && ( <p className="text-xs text-red-400">{errors?.id.message.toString()}</p> )}
          </div> )}
      </div>

      {state.error && (<span className="text-red-500">Something went wrong!</span>)}
      <button disabled={isPending} className="bg-blue-400 text-white p-2 rounded-md disabled:cursor-not-allowed disabled:opacity-50"> 
        {type === "create" ? "Create" : "Update"} 
      </button> 
    </form>
  );
};

export default TeacherForm;