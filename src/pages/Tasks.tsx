import { localDate } from '../utils/date';
import { useState } from 'react';
import { ContextualAI } from '../components/shared/ContextualAI';
import { Page } from '../layouts/AppLayout';
import { useTracklyStore } from '../stores/useTracklyStore';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Plus, Search, Trash2, PanelRight } from '../components/shared/Icons';
import type { Priority, Task } from '../types';

const priorityClass = {
  high: 'task-priority-high',
  medium: 'task-priority-medium',
  low: 'task-priority-low',
};

function TaskForm({ onClose }: { onClose: () => void }) {
  const add = useTracklyStore((s) => s.addTask);

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [due, setDue] = useState(localDate());
  const [priority, setPriority] = useState<Priority>('medium');

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
          aria-label="Task title"
          placeholder="What needs doing?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="input"
          aria-label="Subject or category"
          placeholder="Subject or category"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <div className="task-date-priority">
          <input
            className="input"
            type="date"
            aria-label="Due date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
          />

          <select
            className="input"
            aria-label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="high">High priority</option>
            <option value="medium">Medium priority</option>
            <option value="low">Low priority</option>
          </select>
        </div>

        <button className="btn btn-primary" type="submit">
          Add task
        </button>
      </form>
    </Modal>
  );
}

export function Tasks() {
  const { tasks, updateTask, deleteTask } = useTracklyStore();

  const [q, setQ] = useState('');
  const [add, setAdd] = useState(false);
  const [selected, setSelected] = useState<Task | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const list = tasks.filter(
    (task) => !task.archived && task.title.toLowerCase().includes(q.toLowerCase()),
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

          <button className="btn btn-primary" onClick={() => setAdd(true)}>
            <Plus size={16} style={{ verticalAlign: 'middle' }} /> Add task
          </button>
        </>
      }
    >
      <div className="card" style={{ padding: 14 }}>
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
              onChange={(e) => setQ(e.target.value)}
              style={{
                paddingLeft: 34,
              }}
            />
          </div>

          <button className="btn btn-soft">All work</button>
        </div>

        {/* Task Groups */}
        {(['doing', 'todo', 'done'] as const).map((status) => {
          const rows = list.filter((task) => task.status === status);

          return (
            <section key={status} className="task-group" style={{ marginTop: 18 }}>
              <h2 className="task-group-heading">
                {status === 'doing' ? 'In progress' : status === 'todo' ? 'Up next' : 'Completed'}{' '}
                <span style={{ fontWeight: 400 }}>({rows.length})</span>
              </h2>

              {rows.map((task) => (
                <div key={task.id} className="task-row" data-status={task.status}>
                  {/* Complete Button */}
                  <button
                    aria-label={'Mark ' + task.title + ' complete'}
                    className={'task-toggle' + (task.status === 'done' ? ' completed' : '')}
                    onClick={() =>
                      updateTask(task.id, {
                        status: task.status === 'done' ? 'todo' : 'done',
                      })
                    }
                  >
                    {task.status === 'done' ? '✓' : ''}
                  </button>

                  {/* Task Information */}
                  <button
                    type="button"
                    className="task-info"
                    aria-label={'Edit task: ' + task.title}
                    onClick={() => setSelected(task)}
                  >
                    <div className="task-title">{task.title}</div>

                    <div className="muted task-meta">
                      {task.subject} · due {task.due}
                    </div>
                  </button>

                  {/* Priority */}
                  <span className={'pill task-priority ' + priorityClass[task.priority]}>
                    {task.priority}
                  </span>

                  {/* Open Details */}
                  <button
                    onClick={() => setSelected(task)}
                    aria-label="Open task"
                    className="task-open"
                  >
                    <PanelRight size={17} />
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
      {add && <TaskForm onClose={() => setAdd(false)} />}

      {/* Task Details Modal */}
      {selected && (
        <Modal title="Task details" onClose={() => setSelected(null)}>
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
                aria-label="Task title"
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
                aria-label="Subject or category"
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
                aria-label="Due date"
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
                  const newStatus = selected.status === 'done' ? 'todo' : 'done';

                  updateTask(selected.id, {
                    status: newStatus,
                  });

                  setSelected({
                    ...selected,
                    status: newStatus,
                  });
                }}
              >
                {selected.status === 'done' ? 'Reopen task' : 'Mark complete'}
              </button>

              <button className="btn btn-danger" onClick={() => setConfirmDelete(true)}>
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
          onCancel={() => setConfirmDelete(false)}
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
