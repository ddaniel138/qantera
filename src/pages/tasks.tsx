import DashboardLayout from '@/layouts/Dashboard';
import TasksView from '@/views/Tasks';

export default function YapTasks() {
  return (
    <DashboardLayout>
      <TasksView />
    </DashboardLayout>
  );
}