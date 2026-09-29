import { localDate } from '../utils/date';
import { useState } from 'react';
import { ContextualAI } from '../components/shared/ContextualAI';
import { Page } from '../layouts/AppLayout';
import { useTracklyStore } from '../stores/useTracklyStore';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import {
  Plus,
  Search,
  Trash2,
  PanelRight,
} from '../components/shared/Icons';
import type { Priority, Task } from '../types';

const priorityColor = {
  high: '#df7c62',
  medium: '#c59d5f',
  low: '#6b8fc9',
};

function TaskForm({ onClose }: { onClose: () => void }) {
  const add = useTracklyStore((s) => s.addTask);

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [due, setDue] = useState(localDate());
  const [priority, setPriority] =
    useState<Priority>('medium');

  return (
    <Modal title="Add a task" onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (title.trim()) {
            add({
              title,
              subject: subject || 'General',
              due,
              priority,
              status: 'todo',
              tags: [],
            });

            onClose();
          }
        }}
        style={{
          display: 'grid',
          gap: 12,
        }}
      >
        <input
          autoFocus
          className="input"
          required
          placeholder="What needs doing?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="input"
          placeholder="Subject or category"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
          }}
        >
          <input
            className="input"
            type="date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
          />

          <select
            className="input"
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as Priority)
            }
          >
            <option value="high">High priority</option>
            <option value="medium">Medium priority</option>
            <option value="low">Low priority</option>
          </select>
        </div>

        <button
          className="btn btn-primary"
          type="submit"
        >
          Add task
        </button>
      </form>
    </Modal>
  );
}

export function Tasks() {
  const {
    tasks,
    updateTask,
    deleteTask,
  } = useTracklyStore();

  const [q, setQ] = useState('');
  const [add, setAdd] = useState(false);
  const [selected, setSelected] =
    useState<Task | null>(null);
  const [confirmDelete, setConfirmDelete] =
    useState(false);

  const list = tasks.filter(
    (task) =>
      !task.archived &&
      task.title
        .toLowerCase()
        .includes(q.toLowerCase())
  );

  return (
    <Page
      title="Tasks"
      eyebrow="Keep the next thing clear"
      actions={
        <>
          <ContextualAI
            feature="tasks"
            defaultPrompt="Help me prioritize and break down my current tasks."
          />

          <button
            className="btn btn-primary"
            onClick={() => setAdd(true)}
          >
            <Plus
              size={16}
              style={{ verticalAlign: 'middle' }}
            />{' '}
            Add task
          </button>
        </>
      }
    >
      <div
        className="card"
        style={{ padding: 14 }}
      >
        {/* Search and Filter */}
        <div
          style={{
            display: 'flex',
            gap: 10,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              position: 'relative',
              flex: 1,
            }}
          >
            <Search
              size={16}
              color="#888"
              style={{
                position: 'absolute',
                left: 11,
                top: 11,
              }}
            />

            <input
              className="input"
              aria-label="Search tasks"
              placeholder="Search your tasks"
              value={q}
              onChange={(e) =>
                setQ(e.target.value)
              }
              style={{
                paddingLeft: 34,
              }}
            />
          </div>

          <button className="btn btn-soft">
            All work
          </button>
        </div>

        {/* Task Groups */}
        {(
          ['doing', 'todo', 'done'] as const
        ).map((status) => {
          const rows = list.filter(
            (task) => task.status === status
          );

          return (
            <section
              key={status}
              style={{ marginTop: 18 }}
            >
              <h2
                style={{
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '.08em',
                  color: '#858580',
                  margin: '0 8px 8px',
                }}
              >
                {status === 'doing'
                  ? 'In progress'
                  : status === 'todo'
                  ? 'Up next'
                  : 'Completed'}{' '}
                <span style={{ fontWeight: 400 }}>
                  ({rows.length})
                </span>
              </h2>

              {rows.map((task) => (
                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '13px 8px',
                    borderTop: '1px solid #eee',
                  }}
                >
                  {/* Complete Button */}
                  <button
                    aria-label={
                      'Mark ' +
                      task.title +
                      ' complete'
                    }
                    onClick={() =>
                      updateTask(task.id, {
                        status:
                          task.status === 'done'
                            ? 'todo'
                            : 'done',
                      })
                    }
                    style={{
                      height: 20,
                      width: 20,
                      borderRadius: 6,
                      border:
                        '1.5px solid #bdbdb8',
                      background:
                        task.status === 'done'
                          ? '#292a29'
                          : 'white',
                      color: 'white',
                    }}
                  >
                    {task.status === 'done'
                      ? '✓'
                      : ''}
                  </button>

                  {/* Task Information */}
                  <div
                    style={{
                      flex: 1,
                      cursor: 'pointer',
                    }}
                    onClick={() =>
                      setSelected(task)
                    }
                  >
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        textDecoration:
                          task.status === 'done'
                            ? 'line-through'
                            : 'none',
                        color:
                          task.status === 'done'
                            ? '#888'
                            : '#272727',
                      }}
                    >
                      {task.title}
                    </div>

                    <div
                      className="muted"
                      style={{
                        fontSize: 12,
                        marginTop: 3,
                      }}
                    >
                      {task.subject} · due{' '}
                      {task.due}
                    </div>
                  </div>

                  {/* Priority */}
                  <span
                    className="pill"
                    style={{
                      background:
                        priorityColor[
                          task.priority
                        ] + '22',
                      color:
                        priorityColor[
                          task.priority
                        ],
                    }}
                  >
                    {task.priority}
                  </span>

                  {/* Open Details */}
                  <button
                    onClick={() =>
                      setSelected(task)
                    }
                    aria-label="Open task"
                    style={{
                      border: 0,
                      background: 'none',
                    }}
                  >
                    <PanelRight
                      size={17}
                      color="#888"
                    />
                  </button>
                </div>
              ))}

              {/* Empty State */}
              {!rows.length && (
                <div
                  className="muted"
                  style={{
                    padding: '12px 8px',
                    fontSize: 13,
                  }}
                >
                  Nothing here yet.
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {add && (
        <TaskForm
          onClose={() => setAdd(false)}
        />
      )}

      {/* Task Details Modal */}
      {selected && (
        <Modal
          title="Task details"
          onClose={() => setSelected(null)}
        >
          <div
            style={{
              display: 'grid',
              gap: 15,
            }}
          >
            <div
              style={{
                display: 'grid',
                gap: 8,
              }}
            >
              {/* Title */}
              <input
                className="input"
                value={selected.title}
                onChange={(e) => {
                  updateTask(selected.id, {
                    title: e.target.value,
                  });

                  setSelected({
                    ...selected,
                    title: e.target.value,
                  });
                }}
              />

              {/* Subject */}
              <input
                className="input"
                value={selected.subject}
                onChange={(e) => {
                  updateTask(selected.id, {
                    subject: e.target.value,
                  });

                  setSelected({
                    ...selected,
                    subject: e.target.value,
                  });
                }}
              />

              {/* Due Date */}
              <input
                className="input"
                type="date"
                value={selected.due}
                onChange={(e) => {
                  updateTask(selected.id, {
                    due: e.target.value,
                  });

                  setSelected({
                    ...selected,
                    due: e.target.value,
                  });
                }}
              />
            </div>

            {/* Task Actions */}
            <div
              style={{
                display: 'flex',
                gap: 8,
              }}
            >
              <button
                className="btn btn-soft"
                onClick={() => {
                  const newStatus =
                    selected.status === 'done'
                      ? 'todo'
                      : 'done';

                  updateTask(selected.id, {
                    status: newStatus,
                  });

                  setSelected({
                    ...selected,
                    status: newStatus,
                  });
                }}
              >
                {selected.status === 'done'
                  ? 'Reopen task'
                  : 'Mark complete'}
              </button>

              <button
                className="btn"
                style={{
                  color: '#b45242',
                  background: '#f9eeee',
                }}
                onClick={() =>
                  setConfirmDelete(true)
                }
              >
                <Trash2
                  size={15}
                  style={{
                    verticalAlign: 'middle',
                  }}
                />{' '}
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && selected && (
        <ConfirmDialog
          title="Delete this task?"
          description={`"${selected.title}" will be removed from your workspace. You cannot undo this action.`}
          onCancel={() =>
            setConfirmDelete(false)
          }
          onConfirm={() => {
            deleteTask(selected.id);
            setConfirmDelete(false);
            setSelected(null);
          }}
        />
      )}
    </Page>
  );
}