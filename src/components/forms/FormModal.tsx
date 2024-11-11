"use client";

/*we separeted FormModalContainer & FormModal components because FormModalContainer has to be server component to fetch: 
needed extra data to select from inside (create/update) forms, but formModal has to be client component as we use hooks*/
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useFormState } from "react-dom";
import { deleteTeacher } from "@/lib/actions/teacher.actions";
import { deleteStudent } from "@/lib/actions/student.actions";
import { deleteSubject } from "@/lib/actions/subject.actions";
import { deleteClass } from "@/lib/actions/class.actions";
import { deleteExam } from "@/lib/actions/exam.actions";
//For modal optimization (import only needed form), import by LAZY LOADING instead of importing directly like: import TeacherForm from "./TeacherForm"; & ...
import dynamic from "next/dynamic";
const TeacherForm = dynamic(() => import("./TeacherForm"), { loading: () => <h1>Loading...</h1> });
const StudentForm = dynamic(() => import("./StudentForm"), { loading: () => <h1>Loading...</h1> });
const SubjectForm = dynamic(() => import("./SubjectForm"), { loading: () => <h1>Loading...</h1>});
const ClassForm = dynamic(() => import("./ClassForm"), { loading: () => <h1>Loading...</h1>});
const ExamForm = dynamic(() => import("./ExamForm"), { loading: () => <h1>Loading...</h1>});


//receiving all FormModalContainer props + relatedData of DB models in relation, pass it to (create/update) forms to choose from, then show it in it's table fields after form submit       
const FormModal = ({ table, type, data, id, relatedData }: {
  table: "teacher" | "student" | "parent" | "subject" | "class" | "lesson" | "exam" | "assignment" | "result" | "attendance" | "event" | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string; 
  relatedData?: any 
}) => {

  const [open, setOpen] = useState(false);         //state to check if modal is open or closed

  //DELETE FORM SERVER_ACTIONS HANDLING
  //useFormState/useActionState is a modern react hook used to update a state value based on server action result [in this case, the state named state & the action named formAction & we pass (deleteActions_conditions -> the server_action , {success: false, error: false} -> state default value)] 
  const [state, formAction] = useFormState((table === "teacher") && deleteTeacher as any
      || (table === "student") && deleteStudent 
      || (table === "subject") && deleteSubject
      || (table === "class") && deleteClass
      || (table === "exam") && deleteExam
    , { success: false, error: false } );  
  //if useFormState() -> {succes:true}, Show succes toast & close the modal 
  useEffect(() => {
    if (state.success) {
      toast(`${table} has been deleted!`);
      setOpen(false);       
    }
  }, [state]);


  return (
    <>
      {/*(create/update/delete) button will open the modal, Also changing (size & bgColor & img src) depending on the button type */}
      <button onClick={() => setOpen(true)} className={`${type === "create" ? "w-8 h-8" : "w-7 h-7"} flex items-center justify-center rounded-full ${type === "create" ? "bg-schoolYellow" : type === "update" ? "bg-schoolSky" : "bg-schoolPurple"}`} >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>

      {/*if the modal opened, render the form depending on the type (delete/create/update) */}
      {open && (
        //modal outer container, closes onClick() .. inner container will use stopPropagation() to prevent the parent closing onClick() event
        <div onClick={() => setOpen(false)} className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div onClick={(e) => e.stopPropagation()} className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
          
          {/*All delete forms design are similar: in the modal, show this form that will use server_action onSubmit but after we pass it to useFormState() hook to get success/error message */}
          { type === "delete" && id ? (
            <form action={formAction} className="p-4 flex flex-col gap-4">
              <input type="text | number" name="id" value={id} hidden />      {/* Sending the id in hidden input */}
              <span className="text-center font-medium"> Data will be lost. Are you sure you want to delete this {table}? </span>
              <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center"> Delete </button>
            </form> ) 
            /* create/update forms are different based on table type: So, in the modal, show different imported Form component */
            : (type === "create" || type === "update") ? (table === "teacher") && <TeacherForm type={type} data={data} setOpen={setOpen} relatedData={relatedData}/> 
                  || (table === "student") && <StudentForm type={type} data={data} setOpen={setOpen} relatedData={relatedData}/> 
                  || (table === "subject") && <SubjectForm type={type} data={data} setOpen={setOpen} relatedData={relatedData}/>
                  || (table === "class") && <ClassForm type={type} data={data} setOpen={setOpen} relatedData={relatedData}/>
                  || (table === "exam") && <ExamForm type={type} data={data} setOpen={setOpen} relatedData={relatedData}/>
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