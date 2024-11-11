import prisma from "@/lib/prisma";
import Image from "next/image";

//receive the type prop, to show differant user type for each cards
const UserCard =  async ({type}: { type: "admin" | "teacher" | "student" | "parent"}) => {
  
  let data = 0 ;                        //variable to store the count of the received user_type prop
  switch (type) {
    case "admin":
      data = await prisma.admin.count();             //get count of admin model, using prisma.count() 
      break;
    case "teacher":
      data = await prisma.teacher.count();           //get count of teacher model, using prisma.count() 
      break; 
    case "student":
      data = await prisma.student.count();           //get count of student model, using prisma.count() 
      break;
    case "parent":
      data = await prisma.parent.count();            //get count of parent model, using prisma.count() 
      break;  
    default:
      break;
  }

  return (
    <div className="rounded-2xl odd:bg-schoolPurple even:bg-schoolYellow p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          2024/25
        </span>
        <Image src="/more.png" alt="" width={20} height={20} />
      </div>
      <h1 className="text-2xl font-semibold my-4">{data}</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500">{type}s</h2>
    </div>
  );
};

export default UserCard;