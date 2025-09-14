"use client";

import { LoadingPage } from "@/components/components";
import { useAuth } from "@/context/auth-context";
import { deleteTask, getTasks } from "@/lib/lib";
import { AnimatePresence, motion } from "motion/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { FaGripLines, FaPencil, FaRegTrashCan } from "react-icons/fa6";
import { useTask } from "@/context/task-context";
import { Priority, Status } from "@/lib/tasks";

type TaskData = {
  task_id: string;
  title: string;
  description: string;
  due_date: string;
  status: string;
  priority: string;
};

type Filters = {
  dueDate?: "today" | "week" | "overdue";
  status?: Status;
  priority?: Priority;
};

export default function Dashboard() {
  const { authenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [allTasks, setAllTasks] = useState<TaskData[]>([]);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [isFiltersHidden, setFilterHidden] = useState<boolean>(false);
  const { setSelectedTaskId } = useTask();
  const [filters, setFilters] = useState<Filters>({});

  async function fetchData() {
    try {
      const data = await getTasks();
      setAllTasks(data);
      setTasks(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function filterTasks(newFilters: Filters) {
    setFilters(newFilters);

    let filtered = [...allTasks];
    const today = new Date();

    switch (newFilters.dueDate) {
      case "today":
        filtered = filtered.filter(
          (task) =>
            new Date(task.due_date).toDateString() === today.toDateString(),
        );
        break;
      case "week":
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        filtered = filtered.filter(
          (task) =>
            new Date(task.due_date) >= today &&
            new Date(task.due_date) <= nextWeek,
        );
        break;
      case "overdue":
        filtered = filtered.filter((task) => new Date(task.due_date) < today);
        break;
      default:
        break;
    }

    if (newFilters.status) {
      filtered = filtered.filter((task) => task.status === newFilters.status);
    }

    if (newFilters.priority) {
      filtered = filtered.filter(
        (task) => task.priority === newFilters.priority,
      );
    }

    setTasks(filtered);
  }

  useEffect(() => {
    if (!authenticated) redirect("/");

    fetchData();
  }, []);

  if (loading) return <LoadingPage />;

  const filterVariations = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const taskVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  return (
    <>
      <div className="h-screen flex flex-col">
        {/* filters */}
        <div className="flex flex-col gap-2 p-4">
          <button
            className="btn btn-ghost"
            onClick={() => {
              (
                document.getElementById(
                  "task_modal_create",
                ) as HTMLDialogElement
              )?.showModal();
            }}
          >
            {"Create Task +"}
          </button>
          {isFiltersHidden ? (
            <button
              className="btn btn-sm btn-circle btn-ghost"
              onClick={() => {
                setFilterHidden(false);
              }}
            >
              <FaGripLines />
            </button>
          ) : (
            <>
              <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => {
                  setFilterHidden(true);
                }}
              >
                x
              </button>
              <AnimatePresence>
                {!isFiltersHidden && (
                  <motion.div
                    className="flex flex-col gap-4"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={filterVariations}
                  >
                    {/* due date */}
                    <form className="filter gap-4">
                      <input
                        className="btn btn-square"
                        type="reset"
                        value="×"
                        onClick={(e) => {
                          filterTasks({ ...filters, dueDate: undefined });
                        }}
                      />
                      <input
                        className="btn"
                        type="radio"
                        name="due_date"
                        aria-label="Today"
                        onClick={() => {
                          filterTasks({ ...filters, dueDate: "today" });
                        }}
                      />
                      <input
                        className="btn"
                        type="radio"
                        name="due_date"
                        aria-label="Week"
                        onClick={() => {
                          filterTasks({ ...filters, dueDate: "week" });
                        }}
                      />
                      <input
                        className="btn"
                        type="radio"
                        name="due_date"
                        aria-label="Over Due"
                        onClick={() => {
                          filterTasks({ ...filters, dueDate: "overdue" });
                        }}
                      />
                    </form>

                    {/* status */}
                    <form className="filter gap-4">
                      <input
                        className="btn btn-square"
                        type="reset"
                        value="×"
                        onClick={(e) => {
                          filterTasks({ ...filters, status: undefined });
                        }}
                      />
                      <input
                        className="btn"
                        type="radio"
                        name="status"
                        aria-label="To Do"
                        onClick={() =>
                          filterTasks({ ...filters, status: "todo" })
                        }
                      />
                      <input
                        className="btn"
                        type="radio"
                        name="status"
                        aria-label="In Progress"
                        onClick={() =>
                          filterTasks({ ...filters, status: "in_progress" })
                        }
                      />
                      <input
                        className="btn"
                        type="radio"
                        name="status"
                        aria-label="Done"
                        onClick={() =>
                          filterTasks({ ...filters, status: "done" })
                        }
                      />
                    </form>

                    {/* priority */}
                    <form className="filter gap-4">
                      <input
                        className="btn btn-square"
                        type="reset"
                        value="×"
                        onClick={(e) => {
                          filterTasks({ ...filters, priority: undefined });
                        }}
                      />
                      <input
                        className="btn btn-soft btn-error"
                        type="radio"
                        name="priority"
                        aria-label="High"
                        onClick={() =>
                          filterTasks({ ...filters, priority: "high" })
                        }
                      />
                      <input
                        className="btn btn-soft btn-warning"
                        type="radio"
                        name="priority"
                        aria-label="Medium"
                        onClick={() =>
                          filterTasks({ ...filters, priority: "medium" })
                        }
                      />
                      <input
                        className="btn btn-soft btn-success"
                        type="radio"
                        name="priority"
                        aria-label="Low"
                        onClick={() =>
                          filterTasks({ ...filters, priority: "low" })
                        }
                      />
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>

        {/* tasks */}
        <ul className="flex-1 w-full p-4 space-y-4">
          <AnimatePresence>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <motion.div
                  key={task.task_id}
                  className="indicator w-full"
                  variants={taskVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                >
                  {task.priority === "high" && (
                    <span className="indicator-item indicator-start status status-error"></span>
                  )}

                  {task.priority === "medium" && (
                    <span className="indicator-item indicator-start status status-warning"></span>
                  )}

                  {task.priority === "low" && (
                    <span className="indicator-item indicator-start status status-success"></span>
                  )}

                  <li className="w-full flex justify-between items-start border rounded p-4 shadow">
                    <div>
                      <div>{task.title}</div>
                      <div className="text-xs uppercase font-semibold opacity-60">
                        {task.status}
                      </div>
                      <div className="text-xs">{task.due_date}</div>
                      <p className="text-xs">{task.description}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="btn btn-square btn-ghost"
                        onClick={() => {
                          (
                            document.getElementById(
                              "task_modal_edit",
                            ) as HTMLDialogElement
                          )?.showModal();

                          setSelectedTaskId(task.task_id);
                        }}
                      >
                        <FaPencil />
                      </button>
                      <button
                        className="btn btn-square btn-ghost"
                        onClick={() => {
                          deleteTask(task.task_id);
                        }}
                      >
                        <FaRegTrashCan />
                      </button>
                    </div>
                  </li>
                </motion.div>
              ))
            ) : (
              <div className="flex flex-row items-center w-screen font-bold">
                {" No Tasks "}
              </div>
            )}
          </AnimatePresence>
        </ul>
      </div>
    </>
  );
}
