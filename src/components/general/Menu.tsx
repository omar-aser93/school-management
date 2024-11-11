import { currentUser } from "@clerk/nextjs/server";        //clerk currentUser() is preferred in components (outside App router)
import MenuLink from "./MenuLink"


const Menu = async () => {
  
  const user = await currentUser();                          //get clerk current user, using currentUser() hook
  const role = user?.publicMetadata.role as string;          //get user role that we stored in his publicMetadata 

  //Array to store the menue Items data, So we can loop through it instead of setting it one by one
  const menuItems = [
    {
      title: "MENU",
      items: [
        { icon: "/home.png", label: "Home", href: `/${role}`, visible: ["admin", "teacher", "student", "parent"] },
        { icon: "/teacher.png", label: "Teachers", href: "/list/teachers", visible: ["admin", "teacher"] },
        { icon: "/student.png", label: "Students", href: "/list/students", visible: ["admin", "teacher"] },
        { icon: "/parent.png", label: "Parents", href: "/list/parents", visible: ["admin", "teacher"] },
        { icon: "/subject.png", label: "Subjects", href: "/list/subjects", visible: ["admin"] },
        { icon: "/class.png", label: "Classes", href: "/list/classes", visible: ["admin", "teacher"] },
        { icon: "/lesson.png", label: "Lessons", href: "/list/lessons", visible: ["admin", "teacher"] },
        { icon: "/exam.png", label: "Exams", href: "/list/exams", visible: ["admin", "teacher", "student", "parent"] },
        { icon: "/assignment.png", label: "Assignments", href: "/list/assignments", visible: ["admin", "teacher", "student", "parent"] },
        { icon: "/result.png", label: "Results", href: "/list/results", visible: ["admin", "teacher", "student", "parent"] },
        { icon: "/attendance.png", label: "Attendance", href: "/list/attendance", visible: ["admin", "teacher", "student", "parent"] },
        { icon: "/calendar.png", label: "Events", href: "/list/events", visible: ["admin", "teacher", "student", "parent"] },
        { icon: "/message.png", label: "Messages", href: "/list/messages", visible: ["admin", "teacher", "student", "parent"] },
        { icon: "/announcement.png", label: "Announcements", href: "/list/announcements", visible: ["admin", "teacher", "student", "parent"] }
      ]
    },
    {
      title: "OTHER",
      items: [
        { icon: "/profile.png", label: "Profile", href: "/profile", visible: ["admin", "teacher", "student", "parent"] },
        { icon: "/setting.png", label: "Settings", href: "/settings", visible: ["admin", "teacher", "student", "parent"] },
        { icon: "/logout.png", label: "Logout", href: "/logout", visible: ["admin", "teacher", "student", "parent"] }
      ]
    }
  ];

  return (
    <div className="mt-4 text-sm ">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4"> {i.title} </span>
          {/*Map through items & check if {visible} contains current user type (admin/teacher/student/parent), if so then render that item */}
          {i.items.map((item) => {
            if (item.visible.includes(role)) {          
              return (
                <MenuLink item={item} />
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;