"use client";

import { useForm } from "react-hook-form";     //using "react-hook-form" gives better performance & simplicity for complex forms
import { zodResolver } from "@hookform/resolvers/zod";
import { classSchema, ClassSchemaType } from "@/lib/formsValidation";
import { createClass, updateClass } from "@/lib/actions/class.actions";
import { useFormState } from "react-dom";
import { useEffect, Dispatch, SetStateAction, useTransition } from "react";    //Dispatch, SetStateAction used for Typescript type of setopen() prop
import { toast } from "react-toastify";


/* This form component will be used for both "create class" & "update class", We receive a type prop (create/update) & change server_action and text by it, 
  also a data prop but only for the update form to set inputs defaultValues, a setOpen prop to close the modal after submit, a relatedData prop (needed data from related DB models)  */
const ClassForm = ({ type, data, setOpen, relatedData }: {type: "create" | "update"; data?: any; setOpen: Dispatch<SetStateAction<boolean>>; relatedData?: any;}) => {
    
  //using useForm() hook, to handle the form & the inputs, we pass (Zod Schema) to the zodResolver of "react-hook-form" 
  const {  register, handleSubmit, formState: { errors } } = useForm<ClassSchemaType>({ resolver: zodResolver(classSchema) });

  //useFormState/useActionState is a modern react hook used to update a state value based on server action result [in this case, the state named state & the action named formAction & we pass (createClass/updateClass -> the server_action , {success: false, error: false} -> state default value)] 
  const [state, formAction] = useFormState( type === "create" ? createClass : updateClass, { success: false, error: false });
  const [isPending, startTransition] = useTransition();      //replacement to useFormStatus(), because it doesn't work with "react-hook-form", not needed with useActionState() in the future

  //if useFormState() -> {succes:true}, Show succes toast & close the modal  
  useEffect(() => {
    if (state.success) {
      toast(`Subject has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);      
    }
  }, [state, type, setOpen]);
  

  return (
    //passing "react-hook-form" handleSubmit function, we'll use the server_action but after we pass it to useFormState() hook, to get success/error message
    <form className="flex flex-col gap-8" onSubmit={handleSubmit((data) => { startTransition(() => {formAction(data)}) })}>
      <h1 className="text-xl font-semibold"> {type === "create" ? "Create a new class" : "Update the class"} </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class name</label>
          <input type="text" {...register("name")} defaultValue={data?.name} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" />
          {errors?.name?.message && ( <p className="text-xs text-red-400">{errors?.name.message.toString()}</p> )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Capacity</label>
          <input type="text" {...register("capacity")} defaultValue={data?.capacity} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" />
          {errors?.capacity?.message && ( <p className="text-xs text-red-400">{errors?.capacity.message.toString()}</p> )}
        </div>

        {/* getting teachers from relatedData prop & mapping through it, to choose the class_supervisor inside the form */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Supervisor</label>
          <select {...register("supervisorId")} defaultValue={data?.teachers} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full">
            {relatedData?.teachers.map(
              (teacher: { id: string; name: string; surname: string }) => (
                <option value={teacher.id} key={teacher.id} selected={data && teacher.id === data.supervisorId} >
                  {teacher.name + " " + teacher.surname}
                </option>
              )
            )}
          </select>
          {errors.supervisorId?.message && ( <p className="text-xs text-red-400"> {errors.supervisorId.message.toString()} </p> )}
        </div>

        {/* getting grades from relatedData prop & mapping through it, to choose the class_grade inside the form */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Grade</label>
          <select {...register("gradeId")} defaultValue={data?.gradeId} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" >
            {relatedData?.grades.map((grade: { id: number; level: number }) => (
              <option value={grade.id} key={grade.id} selected={data && grade.id === data.gradeId} > {grade.level} </option>
            ))}
          </select>
          {errors.gradeId?.message && ( <p className="text-xs text-red-400"> {errors.gradeId.message.toString()} </p> )}
        </div>

        {/* Sending the id in a hidden input, used in (update & delete) server_action  */}
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

export default ClassForm;