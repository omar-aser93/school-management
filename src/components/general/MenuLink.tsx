"use client"

import Image from 'next/image';
import Link from 'next/link'
import { usePathname } from 'next/navigation'

//Typescript type of received prop
type ItemType = {   
  icon: string ;
  label: string;
  href: string;
  visible: string[];  
}

//We separated it because menue is server component with (async/await) to get clerk user, but this is client component as we use usePathname() hook 
const MenuLink = ({item} : {item: ItemType} ) => {
  
  const pathname = usePathname();         //get pathname function, to get current URL  
  const isActive = pathname.includes(item.href) && item.href.length > 1;  //get if the active menue link value is part of the current URL, so we can change it's style
  
  return (
    <Link href={item.href} key={item.label} className={`${isActive && "bg-[#EDF9FD]"} flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-schoolSkyLight `} >
      <Image src={item.icon} alt="" width={20} height={20} />
      <span className="hidden lg:block">{item.label}</span>
    </Link>
  );
}

export default MenuLink