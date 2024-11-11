"use client";

import { useRouter } from "next/navigation";


const Pagination = ({currentPage, numberOfPages, Items_Per_Page}: {currentPage: number; numberOfPages: number; Items_Per_Page: number}) => {

  const router = useRouter();        //get router function, to redirect manually
  //creating an arry of pages numbers, so we can loop through it and render the pages numbers buttons
  const pages: number[] = [];
  for (let i = 1; i <= numberOfPages; i++) { pages.push(i) } ;

  //function to change the page when we click a pagination button, we pass the page number (newPage)
  const changePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);    //get full URL params
    params.set("page", newPage.toString());                        //change only "?page=" param
    router.push(`${window.location.pathname}?${params}`);          //redirect to the page we want using the new param
  };

    return (
      <div className="p-4 flex items-center justify-between text-gray-500">
      {/* Prev Button */}
      <button className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() =>  changePage(currentPage - 1)}  
              disabled={!(Items_Per_Page * (currentPage - 1) > 0)} >
        Prev
      </button>
      
      <div className="flex items-center gap-2 text-sm">  
        {/*1st page button */}
        <button onClick={() => changePage(1)} className="px-2 rounded-sm" disabled={currentPage === 1}> {'<<'} </button>  
        {/*pagination buttons: map through the pages numbers array we created & pass the value to changePage() function */}
        {pages.map((p) => (     
          <button onClick={() => changePage(p)} key={p} className={`px-2 rounded-sm ${currentPage === p ? "bg-schoolSky" : ""}`} >
            {p}  
          </button>
        ))} 
         {/*last page button */}
        <button onClick={() => changePage(numberOfPages)} className="px-2 rounded-sm" disabled={currentPage === numberOfPages}> {'>>'} </button>  
      </div>

      {/* Next Button */}
      <button className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => changePage(currentPage + 1)}
              disabled={!(Items_Per_Page * (currentPage - 1) + Items_Per_Page < (numberOfPages * Items_Per_Page))} >
        Next
      </button>
    </div>
    );
  };
  
  export default Pagination;