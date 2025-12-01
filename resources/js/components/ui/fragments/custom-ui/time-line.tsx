import { GitCompare, GitFork, GitMerge, GitPullRequest, HistoryIcon } from "lucide-react";

import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/fragments/shadcn-ui/timeline";
import { KelasDetailSchema } from "@/lib/validations/app/kelasDetailValidate";
import { getStatusKelasIcon } from "@/lib/utils/index";
import { StatusKelas } from "@/config/enums/StatusKelas";
    import { formatDistanceToNow } from 'date-fns';
// const items = [
//   {
//     date: "15 minutes ago",
//     description:
//       "Forked the repository to create a new branch for development.",
//     icon: GitFork,
//     id: 1,
//     title: "Forked Repository",
//   },
//   {
//     date: "10 minutes ago",
//     description:
//       "Submitted PR #342 with new feature implementation. Waiting for code review from team leads.",
//     icon: GitPullRequest,
//     id: 2,
//     title: "Pull Request Submitted",
//   },
//   {
//     date: "5 minutes ago",
//     description:
//       "Received comments on PR. Minor adjustments needed in error handling and documentation.",
//     icon: GitCompare,
//     id: 3,
//     title: "Comparing Branches",
//   },
//   {
//     description:
//       "Merged the feature branch into the main branch. Ready for deployment.",
//     icon: GitMerge,
//     id: 4,
//     title: "Merged Branch",
//   },
// ];

export default function TimelineCard({ History }: {History : KelasDetailSchema[]}) {
  return (
    <Timeline defaultValue={3}>
      {History.map((item, i) => 
      {
              const pastDate = new Date(item.created_at!).toLocaleDateString();
      const timeAgo = formatDistanceToNow(pastDate, { addSuffix: true });

        const status = item.status_kelas as StatusKelas
        const Icon = getStatusKelasIcon(status)
        return(
        <TimelineItem
          className="group-data-[orientation=vertical]/timeline:ms-10"
          key={item.id}
          step={i + 1}
        >
          <TimelineHeader>
            <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
            <TimelineTitle className="mt-0.5">{item.status_kelas}</TimelineTitle>
            <TimelineIndicator className="group-data-[orientation=vertical]/timeline:-left-7 flex size-6 items-center justify-center border-none bg-primary/10 group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground">
              <Icon size={14} />
            </TimelineIndicator>
          </TimelineHeader>
          <TimelineContent>
            {item.keterangan}
            <TimelineDate className="mt-2 mb-0">{timeAgo ||  "N/A"}</TimelineDate>
          </TimelineContent>
        </TimelineItem>
      )})}
    </Timeline>
  );
}
