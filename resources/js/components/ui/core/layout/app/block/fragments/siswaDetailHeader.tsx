
   import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/fragments/shadcn-ui/avatar";
import { pagePropsSiswa } from '@/pages/dashboard/siswa/[id]';
import { useInitials } from '@/hooks/use-initials';
 function SiswaDetailHeader({  data}: pagePropsSiswa )  {
          const getInitial = useInitials()
   return (
       <header className=' flex-col md:flex-row text-center md:text-left  flex gap-7 content-center items-center '>
      
      <div className="relative">

       <Avatar className=" rounded-xl  relative flex size-20 shrink-0 overflow-hidden">
                                          <AvatarImage src={`${data?.foto!}`} alt={data.nama_lengkap} />
                                          <AvatarFallback className="rounded-xl  bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                              {getInitial(data.nama_lengkap)}
                                          </AvatarFallback>
                                      </Avatar>
                                      <span className="-end-0.5 -bottom-0.5 absolute size-5 rounded-full border-2 border-background bg-emerald-500">
        <span className="sr-only">Online</span>
      </span>
      </div>
     
<div className="  m-auto w-full   flex flex-col  gap-1  ">
  
<h1 className=" text-2xl m-auto w-full md:text-3xl font-bold      tracking-tighter ">
   
  {data.nama_lengkap}
  </h1>
<p className="text-muted-foreground text-lg ">{data.kelas?.nama_kelas}</p>
</div>
</header>
   )
 }
 
 export default SiswaDetailHeader
 