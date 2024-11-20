import FormModalContainer from "@/components/forms/FormModalContainer";
import Pagination from "@/components/general/Pagination";
import Table from "@/components/general/Table";
import Sort from "@/components/general/Sort";
import TableSearch from "@/components/general/TableSearch";
import Image from "next/image";
import { Assignment, Class, Subject, Teacher } from "@prisma/client";    //getting Typescript types directly from the prisma schema
import { auth } from "@clerk/nextjs/server";                   //clerk auth() preferred with pages (inside App router)
import { getAssignments } from "@/lib/actions/assignment.actions";


const AssignmentListPage = async ({searchParams}: { searchParams: { [key: string]: string | undefined }}) => {  //get url searchParams (queries)

  //clerk auth() hook to get current session_user data & get his role from the metadata
  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  //Array to store columns Headers, we pass it to the table component
  const columns = [
    { header: "Subject Name", accessor: "name" }, { header: "Class", accessor: "class" }, { header: "Teacher", accessor: "teacher", className: "hidden md:table-cell" },
    { header: "Due Date", accessor: "dueDate", className: "hidden md:table-cell" }, 
    ...(role === "admin" || role === "teacher" ? [{ header: "Actions", accessor: "action" }] : [])
  ];


  //renderRow is function that render a single row conent, then we pass it to the table component
  //Note: we can get the types from prisma schema directly (Assignment & other needed models in relation with it), instead of manually (interface Assignment{ id: number; name: string; email?: string; .... };)
  const renderRow = (item: Assignment & { lesson: { subject: Subject; class: Class; teacher: Teacher; }}) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-schoolPurpleLight" >
      <td className="flex items-center gap-4 p-4">{item.lesson.subject.name}</td>
      <td>{item.lesson.class.name}</td>
      <td className="hidden md:table-cell">{item.lesson.teacher.name + " " + item.lesson.teacher.surname}</td>
      <td className="hidden md:table-cell">{new Intl.DateTimeFormat("en-US").format(item.dueDate)}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" || role === "teacher" && (
            <>
              <FormModalContainer table="assignment" type="update" data={item} />
              <FormModalContainer table="assignment" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );


  const {page, sort, ...query}= searchParams ;      //separate URL params to (filter queries) & (page param) & (sort param) 
  const currentPage = page ? parseInt(page) : 1;    //convert Page query from string to number, set default to 1
  const Items_Per_Page = 10 ;  
  //using getAssignments(filter,page queries) function to Fetch {assignmentsData, numberOfPages}, we pass them to the table & the pagination components
  const data = await getAssignments(query, currentPage, Items_Per_Page, sort); 


  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold"> All Assignments </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-schoolYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <Sort />
            {role === "admin" || role === "teacher" && <FormModalContainer table="assignment" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data?.assignmentsData} />
      {/* PAGINATION */}
      {data?.numberOfPages && <Pagination currentPage={currentPage} numberOfPages={data?.numberOfPages} Items_Per_Page={Items_Per_Page}/>}
    </div>
  );
};

export default AssignmentListPage;