import { PlaceholderPattern } from '@/components/ui/fragments/svg-icon/placeholder-pattern';
import AppLayout from '@/components/ui/core/layout/app/app-layout';
import Wrapper from '@/components/ui/core/app/reports/wrapper';
import MainSection from '@/components/ui/core/app/reports/overview';
import { PagePropsOverview } from '@/types';
 



export default function dashboard(props: PagePropsOverview) {
    console.log(props.reports)

    return (
        <>
     <AppLayout>
      <Wrapper>

<MainSection data={props} />
      </Wrapper>
    </AppLayout>
        </>
    );
}
