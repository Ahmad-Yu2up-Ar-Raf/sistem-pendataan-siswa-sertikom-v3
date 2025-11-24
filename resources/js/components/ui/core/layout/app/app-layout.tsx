
import AppLayoutTemplate from './app-sidebar-layout';

import { Head, usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children?: ReactNode;
  
}




export default ({ children, ...props }: AppLayoutProps) => 
{
      const paths = usePage().url
  const pathNames = paths.split('/').filter(path => path)


 const currentPath = pathNames.length - 1 
    return(
    <AppLayoutTemplate  {...props}>
        <Head title={pathNames[currentPath]}/>
           <div className="flex h-full flex-1 flex-col gap-5 rounded-xl p-4 md:p-6 overflow-x-auto">
{children}
           </div>
    </AppLayoutTemplate>
);
}