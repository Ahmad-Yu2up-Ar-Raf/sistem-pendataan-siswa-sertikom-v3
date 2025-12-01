
import ScrollToTop from '@/components/ui/fragments/custom-ui/button/ScrollTop';
import AppLayoutTemplate from './app-sidebar-layout';

import { Head, usePage } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

import { type ReactNode } from 'react';

interface AppLayoutProps {
    children?: ReactNode;
    icon? : LucideIcon
    title? : String
    deskripcion? : string
}




export default ({ children, ...props }: AppLayoutProps) => 
{
      const paths = usePage().url
  const pathNames = paths.split('/').filter(path => path)


 const currentPath = pathNames.length - 1 
    return(
    <AppLayoutTemplate  {...props}>
        <Head title={pathNames[currentPath]}/>
           <div className="flex h-full flex-1 flex-col gap-5 rounded-xl px-4  py-6 md:p-6 overflow-x-auto">
             <div className="flex-1 space-y-2 sm:space-y-7">
{(props.deskripcion && props.title) && (

<header className=' flex-col md:flex-row text-center md:text-left  flex gap-5 content-center items-center '>
   {props.icon && 
    
  <props.icon className=' bg-primary  text-primary-foreground content-center p-2 t rounded-lg size-10'/>
    }
<div className="  m-auto w-full items-center content-center md:gap-2 ">
  
<h1 className=" text-2xl m-auto w-full md:text-3xl font-bold   gap-5 tracking-tighter ">
   
  {props.title}
  </h1>
<p className="text-muted-foreground ">{props.deskripcion}</p>
</div>
</header>
)}



{children}
{/* <OrderDataTable  data={props}/> */}
  {/* <ScrollToTop/> */}
</div>
           </div>

    </AppLayoutTemplate>
);
}