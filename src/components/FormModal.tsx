"use client";

//Note : for this app (Table pages [create/update/delete] forms) will be in a modal instead of a page
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
//For modal optimization, import by LAZY LOADING instead of importing directly like: import TeacherForm from "./TeacherForm";  &  import StudentForm from "./StudentForm";
const TeacherForm = dynamic(() => import("./TeacherForm"), { loading: () => <h1>Loading...</h1> });
const StudentForm = dynamic(() => import("./StudentForm"), { loading: () => <h1>Loading...</h1> });


//recieving props (table's page, Form type [CRUD], date for update form defaultValues, id for delete action )        
const FormModal = ({ table, type, data, id,}: {
  table: "teacher" | "student" | "parent" | "subject" | "class" | "lesson" | "exam" | "assignment" | "result" | "attendance" | "event" | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number;
}) => {

  const [open, setOpen] = useState(false);         //state to check if modal is open or closed
  return (
    <>
      {/*(create/update/delete) button will open the modal, Also it's (size & bgColor & img src) will change depending on the button type */}
      <button onClick={() => setOpen(true)} className={`${type === "create" ? "w-8 h-8" : "w-7 h-7"} flex items-center justify-center rounded-full ${type === "create" ? "bg-schoolYellow" : type === "update" ? "bg-schoolSky" : "bg-schoolPurple"}`} >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>

      {/*if the modal opened, render the form depending on the type (create/update/delete) */}
      {open && (
        //modal outer container, closes onClick() .. inner container will use stopPropagation() to prevent parent close onClick() event
        <div onClick={() => setOpen(false)} className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div onClick={(e) => e.stopPropagation()} className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
          
          {/*For delete button: in the modal, show a form that will use server_action on submit  */}
          { type === "delete" && id ? (
            <form action="" className="p-4 flex flex-col gap-4">
              <span className="text-center font-medium"> Data will be lost. Are you sure you want to delete this {table}? </span>
              <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center"> Delete </button>
            </form> ) 
            /* For create/update button: in the modal, show imported Form component depending on table type */
            : (type === "create" || type === "update") ? (table === "teacher") && <TeacherForm type={type} data={data} /> || (table === "student") && <StudentForm type={type} data={data} />
              : ("Form not found!") 
          }
            {/* X button to close the modal */}
            <div onClick={() => setOpen(false)} className="absolute top-4 right-4 cursor-pointer" >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;