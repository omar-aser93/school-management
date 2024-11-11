import FormModalContainer from "@/components/forms/FormModalContainer";
import Pagination from "@/components/general/Pagination";
import Table from "@/components/general/Table";
import TableSearch from "@/components/general/TableSearch";
import Image from "next/image";
import { Assignment, Class, Exam, Result, Student, Teacher } from "@prisma/client";    //getting Typescript types directly from the prisma schema
import { auth } from "@clerk/nextjs/server";                   //clerk auth() preferred with pages (inside App router)
import { getResults } from "@/lib/actions/result.actions";


const ResultListPage = async ({searchParams}: {searchParams: { [key: string]: string | undefined }}) => {   //get url searchParams (queries)

  //clerk auth() hook to get current session_user data & get his role from the metadata
  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  //Array to store columns Headers, we pass it to the table component
  const columns = [
    { header: "Title", accessor: "title" }, { header: "Student", accessor: "student" }, { header: "Score", accessor: "score", className: "hidden md:table-cell" },
    { header: "Teacher", accessor: "teacher", className: "hidden md:table-cell" }, { header: "Class", accessor: "class", className: "hidden md:table-cell" },
    { header: "Date", accessor: "date", className: "hidden md:table-cell" }, 
    ...(role === "admin" || role === "teacher" ? [{ header: "Actions", accessor: "action" }] : [])
  ];


  //renderRow is function that render a single row conent, then we pass it to the table component
  //Note: we can get the types from prisma schema directly (Result & other needed models in relation with it), instead of manually (interface Result{ id: number; name: string; ... };)
  //Note 2: this row values & types is a bit complex, as the received values can be either for (exam || assignment)
  const renderRow = (item: Result & {exam: Exam} & {assignment: Assignment} & {student: Student} & { exam: {lesson: { class: Class; teacher: Teacher; }}} & { assignment: {lesson: { class: Class; teacher: Teacher; }}}  ) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-schoolPurpleLight" >
      <td className="flex items-center gap-4 p-4">{item.exam?.title || item.assignment?.title }</td>
      <td>{item.student.name + " " + item.student.surname}</td>
      <td className="hidden md:table-cell">{item.score}</td>
      <td className="hidden md:table-cell"> 
        {/*check the result tpye (exam or assignment), then get its teacher full name  */}
        {item.exam && item.exam.lesson.teacher.name  + " " + item.exam.lesson.teacher.surname }
        {item.assignment && item.assignment.lesson.teacher.name  + " " + item.assignment.lesson.teacher.surname}       
      </td>
      <td className="hidden md:table-cell">{item.exam?.lesson.class.name || item.assignment?.lesson.class.name}</td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-US").format(item.exam?.startTime || item.assignment?.startDate)  }
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" || role === "teacher" && (
            <>
              <FormModalContainer table="result" type="update" data={item} />
              <FormModalContainer table="result" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>      
    </tr>    
  );


  const {page, ...query}= searchParams ;            //separate URL params to (filter queries) & (page query) 
  const currentPage = page ? parseInt(page) : 1;    //convert Page query from string to number, set default to 1
  const Items_Per_Page = 10 ;  
  //using getResults(filter,page queries) function to Fetch {resultsData, numberOfPages}, we pass them to the table & the pagination components
  const data = await getResults(query, currentPage, Items_Per_Page); 


  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Results</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-schoolYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-schoolYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" || role === "teacher" && <FormModalContainer table="result" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data?.resultsData} />
      {/* PAGINATION */}
      {data?.numberOfPages && <Pagination currentPage={currentPage} numberOfPages={data?.numberOfPages} Items_Per_Page={Items_Per_Page}/>}
    </div>
  );
};

export default ResultListPage;