import FormModalContainer from "@/components/forms/FormModalContainer";
import Pagination from "@/components/general/Pagination";
import Table from "@/components/general/Table";
import TableSearch from "@/components/general/TableSearch";
import { Class, Subject, Teacher } from "@prisma/client";    //getting Typescript types directly from the prisma schema
import { auth } from "@clerk/nextjs/server";                 //clerk auth() preferred with pages (inside App router)
import Image from "next/image";
import Link from "next/link";
import { getTeachers } from "@/lib/actions/teacher.actions"


const TeacherListPage = async ({searchParams} : {searchParams: {[key: string]: string | undefined }}) => {  //get url searchParams (queries)

  //clerk auth() hook to get current session_user data & get his role from the metadata
  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  //Array to store columns Headers, then we pass it to the table component
  const columns = [
    { header: "Info", accessor: "info" }, { header: "Teacher ID", accessor: "teacherId", className: "hidden md:table-cell" },
    { header: "Subjects", accessor: "subjects", className: "hidden md:table-cell" }, { header: "Classes", accessor: "classes", className: "hidden md:table-cell" },
    { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" }, { header: "Address", accessor: "address", className: "hidden lg:table-cell" }, 
    ...(role === "admin" ? [{ header: "Actions", accessor: "action" }] : [])  //delete/update action buttons for admin only
  ];


  //renderRow is function that render a single row conent, then we pass it to the table component
  //Note: we can get the types from prisma schema directly (Teacher & other needed models in relation with it), instead of manually (interface Teacher{ id: number; name: string; email?: string; .... };)
  const renderRow = (item: Teacher & { subjects: Subject[] } & { classes: Class[] }) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-schoolPurpleLight" >
      <td className="flex items-center gap-4 p-4">
        <Image src={item.img || "/noAvatar.png"} alt="" width={40} height={40} className="md:hidden xl:block w-10 h-10 rounded-full object-cover" />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item?.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.username}</td>
      <td className="hidden md:table-cell">{item.subjects.map((subject) => subject.name).join(",")}</td>
      <td className="hidden md:table-cell">{item.classes.map((classItem) => classItem.name).join(",")}</td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/teachers/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-schoolSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (           
            <>
            <FormModalContainer table="teacher" type="update" data={item} />
            <FormModalContainer table="teacher" type="delete" id={item.id}/>
            </>
          )}
        </div>
      </td>
    </tr>
  );


  const {page, ...query}= searchParams ;            //separate URL params to (filter queries) & (page query) 
  const currentPage = page ? parseInt(page) : 1;    //convert Page query from string to number, set default to 1
  const Items_Per_Page = 10 ;  
  //using getTeachers(filter,page queries) function to Fetch {teachersData, numberOfPages}, we pass them to the table & the pagination components
  const data = await getTeachers(query, currentPage, Items_Per_Page);  


  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Teachers</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-schoolYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-schoolYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && ( <FormModalContainer table="teacher" type="create"/> )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data?.teachersData} />
      {/* PAGINATION */}
      {data?.numberOfPages && <Pagination currentPage={currentPage} numberOfPages={data?.numberOfPages} Items_Per_Page={Items_Per_Page}/>}
    </div>
  );
};

export default TeacherListPage;