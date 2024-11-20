"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Sort = () => {

  const [sort, setSort] = useState("desc");     //state to store sort type
  const router = useRouter();                   //get router function, to redirect manually

  const handleClick = () => {
    setSort(sort === "asc"? "desc" : "asc" );                        //toggle the state value
    const params = new URLSearchParams(window.location.search);      //get full URL params
    params.set("sort", sort );                                       //set "?ascend=" param to the state value
    router.push(`${window.location.pathname}?${params}`);            //redirect to filtered page URL using the new param
  }

  return (
    <>
      <button  onClick={handleClick} className="w-8 h-8 flex items-center justify-center rounded-full bg-schoolYellow">
        <Image src="/sort.png" alt="" width={14} height={14} />
      </button>
    </>
  );
}

export default Sort