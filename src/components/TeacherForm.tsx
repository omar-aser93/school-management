"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

//Zod object used to set form inputs validation conditions, we will pass it to the zodResolver of "react-hook-form"
const schema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters long!" }).max(20, { message: "Username must be at most 20 characters long!" }),
  email: z.string().email({ message: "Invalid email address!" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long!" }),
  firstName: z.string().min(1, { message: "First name is required!" }),
  lastName: z.string().min(1, { message: "Last name is required!" }),
  phone: z.string().min(1, { message: "Phone is required!" }),
  address: z.string().min(1, { message: "Address is required!" }),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.date({ message: "Birthday is required!" }),
  sex: z.enum(["male", "female"], { message: "Sex is required!" }),
  img: z.instanceof(File, { message: "Image is required" }),
});


/* This component will be used for both "create user" & "update user" pages, so we recieve a prop of the page type,
and change the button text by it, also we recieve data prop but only from update page to set inputs defaultValues */
const TeacherForm = ({ type, data }: { type: "create" | "update"; data?: any; }) => {
  
  //using useForm() hook, to handle the form & the inputs (using "react-hook-form" gives better performance & simplicity)
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
  const onSubmit = handleSubmit((data) => { console.log(data); });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">{type} a teacher</h1>
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

      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
        <div className="flex justify-between flex-wrap gap-4">
          <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">First Name</label>
          <input type="text" {...register("firstName")} defaultValue={data?.firstName} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" />
          {errors.firstName?.message && ( <p className="text-xs text-red-400">{errors.firstName.message.toString()}</p> )}
        </div>
        
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Last Name</label>
          <input type="text" {...register("lastName")} defaultValue={data?.lastName} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" />
          {errors.lastName?.message && ( <p className="text-xs text-red-400">{errors.lastName.message.toString()}</p> )}
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

        <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
          <label htmlFor="img" className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer" >
            <Image src="/upload.png" alt="" width={28} height={28} />
            <span>Upload a photo</span>
          </label>
          <input type="file" id="img" {...register("img")} className="hidden" />
          {errors.img?.message && (<p className="text-xs text-red-400"> {errors.img.message.toString()} </p>)}
        </div>
      </div>

      <button className="bg-blue-400 text-white p-2 rounded-md"> {type} </button>
    </form>
  );
};

export default TeacherForm;