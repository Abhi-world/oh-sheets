type AutomationType = 'status' | 'date' | 'button' | 'column' | 'person' | 'group' | 'item' | 'form' | 'periodic';

export const getAutomationExplanation = (automationType: AutomationType): string => {
  switch (automationType) {
    case 'status':
      return "This automation monitors status changes in your Monday.com board. When a task's status changes (e.g., from 'Working on it' to 'Done'), it automatically updates your Google Sheet. For example, if you mark a task as 'Complete', the automation will instantly add a new row to your sheet with the task details, status, and completion time. This helps teams track progress, generate status reports, and maintain a history of completed work without manual data entry.";
    case 'date':
      return "This automation tracks date-related events in your Monday.com board. When a task's date matches your specified trigger (like 'today' or '2 days before deadline'), it automatically exports that task's information to Google Sheets. For instance, if you set it to trigger '3 days before due date', it will create a row in your sheet for each task approaching its deadline, helping you stay ahead of upcoming work and manage deadlines effectively.";
    case 'button':
      return "This automation adds a custom action button to your Monday.com items. When someone clicks this button, it instantly exports the item's data to your specified Google Sheet. For example, you might add an 'Approve' button that, when clicked, moves the item's details to an 'Approved Items' spreadsheet. This gives you manual control over when data is exported while automating the export process itself, perfect for approval workflows or quality control processes.";
    case 'column':
      return "This automation watches for changes in specific column values on your Monday.com board. When a value changes (like priority level changing from 'Low' to 'High'), it automatically updates your Google Sheet. For instance, if you're tracking project priorities, whenever a task's priority is updated, the automation will record this change in your sheet, helping you maintain an up-to-date list of high-priority items and track how priorities shift over time.";
    case 'person':
      return "This automation tracks changes in task assignments on your Monday.com board. When someone is assigned to or removed from a task, it automatically records this change in your Google Sheet. For example, when a team member is assigned to a new task, the automation adds an entry to your sheet showing who was assigned, when, and to what task. This helps track workload distribution, maintain assignment history, and monitor team capacity.";
    case 'group':
      return "This automation monitors when items move between groups in your Monday.com board. When an item moves from one group to another (like from 'Planning' to 'In Progress'), it records this transition in your Google Sheet. For example, if you move a task from 'To Do' to 'In Progress', the automation logs when this happened, helping you track how work flows through different stages and identify bottlenecks in your process.";
    case 'item':
      return "This automation triggers whenever new items are created in your Monday.com board. As soon as someone adds a new item, all its details are automatically exported to your Google Sheet. For example, when a new task is created, the automation immediately adds its name, creator, creation date, and other details to your sheet. This helps maintain a complete record of all items and when they were created, perfect for tracking new requests or projects.";
    case 'form':
      return "This automation captures Monday.com form submissions and sends them directly to your Google Sheet. When someone submits a form (like a request form or feedback survey), all their responses are automatically organized in your spreadsheet. For example, if you have a client intake form, each submission will create a new row in your sheet with all the client's information, making it easy to track and manage incoming requests without manual data transfer.";
    case 'periodic':
      return "This automation runs on a schedule you define (hourly, daily, weekly, etc.). At your specified times, it automatically exports data from your Monday.com board to Google Sheets. For example, you could set it to create a daily snapshot of all active tasks at 5 PM, or generate a weekly summary every Monday morning. This ensures you have regular, automated updates of your board's status without any manual intervention.";
    default:
      return "This automation helps synchronize your Monday.com data with Google Sheets, streamlining your workflow and keeping your information organized across platforms.";
  }
};