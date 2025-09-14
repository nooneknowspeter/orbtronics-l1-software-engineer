"use client";

import { useState } from "react";
import { createTask, updateTask } from "@/lib/lib";
import { TaskInput } from "@/lib/tasks";
import { useTask } from "@/context/task-context";

type TaskModalMode = "create" | "edit";

export default function TaskModal(props: { id: string; mode: TaskModalMode }) {
  const [error, setError] = useState<string | null>(null);
  const { selectedTaskId } = useTask();

  const createUpdateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries());
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(([key, value]) => value !== ""),
    ) as TaskInput;

    try {
      if (props.mode === "edit") {
        await updateTask(selectedTaskId as string, filteredValues);
      } else {
        await createTask(filteredValues);
      }
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
    }
  };

  return (
    <dialog id={props.id} className="modal">
      <div className="modal-box justify-center">
        {/* close button */}
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        {/* title */}
        {props.mode == "edit" ? (
          <h3 className="font-bold text-lg">{"Edit Task"}</h3>
        ) : (
          <h3 className="font-bold text-lg">{"Create Task"}</h3>
        )}

        {/* form */}
        <form onSubmit={createUpdateTask}>
          <fieldset className="fieldset w-full gap-4">
            {/* title */}
            <p className="label">Title</p>
            {props.mode === "edit" ? (
              <input
                name="title"
                type="text"
                className="input w-full"
                placeholder="Title"
              />
            ) : (
              <input
                name="title"
                type="text"
                className="input w-full"
                placeholder="Title"
                required
              />
            )}

            {/* description */}
            <p className="label">Description</p>
            <input
              name="description"
              type="text"
              className="input w-full"
              placeholder="Description"
            />

            {/* due date */}
            <p className="label">Due Date</p>
            <input name="due_date" type="date" className="input w-full" />

            {/* priority */}
            <p className="label">Priority</p>
            <select
              defaultValue="Priority"
              className="select w-full"
              name="priority"
            >
              <option disabled={true}>Priority</option>
              <option value={"high"}>High</option>
              <option value={"medium"}>Medium</option>
              <option value={"low"}>Low</option>
              <option value={"none"}>None</option>
            </select>

            {/* status */}
            {props.mode === "edit" && (
              <>
                <p className="label">Status</p>
                <select
                  defaultValue="Status"
                  className="select w-full"
                  name="status"
                >
                  <option disabled={true}>Status</option>
                  <option value={"todo"}>To Do</option>
                  <option value={"in_progress"}>In Progress</option>
                  <option value={"done"}>Done</option>
                </select>
              </>
            )}

            {error != null && (
              <>
                <div role="alert" className="alert alert-error alert-soft">
                  <span>Something went wrong</span>
                </div>
              </>
            )}

            {/* buttons */}
            {props.mode === "edit" ? (
              <button className="btn btn-primary" type="submit">
                Update
              </button>
            ) : (
              <button className="btn btn-primary" type="submit">
                Create
              </button>
            )}
          </fieldset>
        </form>
      </div>
    </dialog>
  );
}
