"use client";

import { LoadingPage } from "@/components/components";
import { useAuth } from "@/context/auth-context";
import { deleteTask, getTasks } from "@/lib/lib";
import { AnimatePresence, motion } from "motion/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { FaGripLines, FaPencil, FaRegTrashCan } from "react-icons/fa6";
import { useTask } from "@/context/task-context";

type TaskData = {
  task_id: string;
  title: string;
  description: string;
  due_date: string;
  status: string;
  priority: string;
};

export default function Dashboard() {
  const { authenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<TaskData[]>();
  const [isFiltersHidden, setFilterHidden] = useState<boolean>(false);
  const { setSelectedTaskId } = useTask();

  async function fetchData() {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
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
                      />
                      <input
                        className="btn"
                        type="radio"
                        name="frameworks"
                        aria-label="Today"
                      />
                      <input
                        className="btn"
                        type="radio"
                        name="frameworks"
                        aria-label="Week"
                      />
                      <input
                        className="btn"
                        type="radio"
                        name="frameworks"
                        aria-label="Over Due"
                      />
                    </form>

                    {/* status */}
                    <form className="filter gap-4">
                      <input
                        className="btn btn-square"
                        type="reset"
                        value="×"
                      />
                      <input
                        className="btn"
                        type="radio"
                        name="frameworks"
                        aria-label="To Do"
                      />
                      <input
                        className="btn"
                        type="radio"
                        name="frameworks"
                        aria-label="In Progress"
                      />
                      <input
                        className="btn"
                        type="radio"
                        name="frameworks"
                        aria-label="Done"
                      />
                    </form>

                    {/* priority */}
                    <form className="filter gap-4">
                      <input
                        className="btn btn-square"
                        type="reset"
                        value="×"
                      />
                      <input
                        className="btn btn-soft btn-error"
                        type="radio"
                        name="frameworks"
                        aria-label="High"
                      />
                      <input
                        className="btn btn-soft btn-warning"
                        type="radio"
                        name="frameworks"
                        aria-label="Medium"
                      />
                      <input
                        className="btn btn-soft btn-success"
                        type="radio"
                        name="frameworks"
                        aria-label="Low"
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
          {tasks ? (
            tasks.map((task) => (
              <div key={task.task_id} className="indicator w-full">
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
              </div>
            ))
          ) : (
            <li className="font-bold">{" No Tasks "}</li>
          )}
        </ul>
      </div>
    </>
  );
}
