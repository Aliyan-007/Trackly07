
import { useMemo, useRef, useState } from 'react';
import { Page } from '../layouts/AppLayout';
import { useTracklyStore } from '../stores/useTracklyStore';
import { Modal } from '../components/ui/Modal';
import { Plus, ChevronLeft, ChevronRight, Trash2 } from '../components/shared/Icons';
import { AISchedule } from '../components/timetable/AISchedule';
import type { ScheduleItem } from '../types';
import { localDate } from '../utils/date';

const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type View = 'day' | 'week' | 'month' | 'agenda';

const DAY_START = 0;
const DAY_END = 24 * 60;
const MINUTES_PER_HOUR = 60;
const PIXELS_PER_MINUTE = 1.1;
const HOUR_HEIGHT = MINUTES_PER_HOUR * PIXELS_PER_MINUTE;

const mins = (value: string) => {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
};

const timeFromMinutes = (minutes: number) => {
  const safeMinutes = Math.max(DAY_START, Math.min(DAY_END, minutes));

  if (safeMinutes === DAY_END) {
    return '24:00';
  }

  return `${String(Math.floor(safeMinutes / 60)).padStart(2, '0')}:${String(
    safeMinutes % 60,
  ).padStart(2, '0')}`;
};

const addDays = (date: Date, amount: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
};

const weekStart = (date: Date) => addDays(date, -date.getDay());

const sameEvent = (
  item: Pick<ScheduleItem, 'date' | 'day'>,
  date: Date,
) => {
  return item.date
    ? item.date === localDate(date)
    : item.day === date.getDay();
};

const getEventDate = (item: ScheduleItem, referenceDate: Date) => {
  if (item.date) {
    return item.date;
  }

  return localDate(
    addDays(weekStart(referenceDate), item.day),
  );
};

export function Timetable() {
  const {
    schedule,
    tasks,
    addSchedule,
    updateSchedule,
    deleteSchedule,
  } = useTracklyStore();

  const [view, setView] = useState<View>('week');
  const [cursor, setCursor] = useState(new Date());
  const [add, setAdd] = useState(false);
  const [ai, setAi] = useState(false);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(localDate());
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('10:00');

  const [selected, setSelected] = useState<ScheduleItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const today = localDate();

  const week = useMemo(
    () => names.map((_, index) => addDays(weekStart(cursor), index)),
    [cursor],
  );

  const range =
    view === 'month'
      ? new Intl.DateTimeFormat(undefined, {
          month: 'long',
          year: 'numeric',
        }).format(cursor)
      : view === 'week'
        ? `${new Intl.DateTimeFormat(undefined, {
            month: 'short',
            day: 'numeric',
          }).format(week[0])} — ${new Intl.DateTimeFormat(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }).format(week[6])}`
        : view === 'agenda'
          ? `${new Intl.DateTimeFormat(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }).format(cursor)} — ${new Intl.DateTimeFormat(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }).format(addDays(cursor, 13))}`
          : new Intl.DateTimeFormat(undefined, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            }).format(cursor);

  const move = (amount: number) => {
    setCursor((current) => {
      const next = new Date(current);

      if (view === 'month') {
        next.setMonth(next.getMonth() + amount);
      } else if (view === 'week') {
        next.setDate(next.getDate() + amount * 7);
      } else if (view === 'agenda') {
        next.setDate(next.getDate() + amount * 14);
      } else {
        next.setDate(next.getDate() + amount);
      }

      return next;
    });
  };

  const visible = (dateValue: Date) =>
    schedule
      .filter((item) => sameEvent(item, dateValue))
      .sort((a, b) => mins(a.start) - mins(b.start));

  const calendarDays = useMemo(() => {
    const first = new Date(
      cursor.getFullYear(),
      cursor.getMonth(),
      1,
    );

    const startOfCalendar = weekStart(first);

    return Array.from(
      { length: 42 },
      (_, index) => addDays(startOfCalendar, index),
    );
  }, [cursor]);

  const handleDelete = () => {
    if (!selected) return;

    deleteSchedule(selected.id);
    setConfirmDelete(false);
    setSelected(null);
  };

  const resetAddForm = () => {
    setTitle('');
    setDate(localDate());
    setStart('09:00');
    setEnd('10:00');
  };

  return (
    <Page
      title="Calendar"
      eyebrow={range}
      actions={
        <div className="calendar-actions">
          <button
            className="btn btn-soft"
            onClick={() => move(-1)}
            aria-label="Previous"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            className="btn btn-soft"
            onClick={() => setCursor(new Date())}
          >
            Today
          </button>

          <button
            className="btn btn-soft"
            onClick={() => move(1)}
            aria-label="Next"
          >
            <ChevronRight size={16} />
          </button>

          <button
            className="btn btn-soft"
            onClick={() => setAi(true)}
          >
            Ask AI
          </button>

          <button
            className="btn btn-primary"
            onClick={() => {
              resetAddForm();
              setAdd(true);
            }}
          >
            <Plus size={16} /> Add
          </button>
        </div>
      }
    >
      <div className="calendar-views" role="tablist">
        {(['day', 'week', 'month', 'agenda'] as View[]).map(
          (item) => (
            <button
              role="tab"
              aria-selected={view === item}
              className={view === item ? 'active' : ''}
              key={item}
              onClick={() => setView(item)}
            >
              {item === 'agenda'
                ? 'Hours'
                : item[0].toUpperCase() + item.slice(1)}
            </button>
          ),
        )}
      </div>

      {view === 'week' && (
        <WeekGrid
          dates={week}
          today={today}
          schedule={schedule}
          tasks={tasks}
          onEdit={setSelected}
          onMove={(id, changes) =>
            updateSchedule(id, changes)
          }
        />
      )}

      {view === 'day' && (
        <DayView
          date={cursor}
          events={visible(cursor)}
          tasks={tasks.filter(
            (task) => task.due === localDate(cursor),
          )}
        />
      )}

      {view === 'month' && (
        <MonthView
          days={calendarDays}
          cursor={cursor}
          events={visible}
          tasks={tasks}
          onPick={(day) => {
            setCursor(day);
            setView('day');
          }}
        />
      )}

      {view === 'agenda' && (
        <Agenda
          start={cursor}
          events={visible}
        />
      )}

      {ai && (
        <AISchedule onClose={() => setAi(false)} />
      )}

      {selected && (
        <Modal
          title="Edit calendar session"
          onClose={() => {
            setConfirmDelete(false);
            setSelected(null);
          }}
        >
          <div style={{ display: 'grid', gap: 12 }}>
            <input
              className="input"
              value={selected.title}
              onChange={(event) =>
                setSelected({
                  ...selected,
                  title: event.target.value,
                })
              }
            />

            <input
              className="input"
              type="date"
              value={
                selected.date ||
                localDate(
                  addDays(
                    weekStart(cursor),
                    selected.day,
                  ),
                )
              }
              onChange={(event) => {
                const value = event.target.value;

                if (!value) return;

                const selectedDate = new Date(
                  `${value}T00:00:00`,
                );

                setSelected({
                  ...selected,
                  date: value,
                  day: selectedDate.getDay(),
                });
              }}
            />

            <div
              style={{
                display: 'flex',
                gap: 8,
              }}
            >
              <input
                className="input"
                type="time"
                value={selected.start}
                onChange={(event) =>
                  setSelected({
                    ...selected,
                    start: event.target.value,
                  })
                }
              />

              <input
                className="input"
                type="time"
                value={selected.end}
                onChange={(event) =>
                  setSelected({
                    ...selected,
                    end: event.target.value,
                  })
                }
              />
            </div>

            <div
              style={{
                display: 'flex',
                gap: 8,
                flexWrap: 'wrap',
              }}
            >
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (
                    !selected.title.trim() ||
                    mins(selected.end) <= mins(selected.start)
                  ) {
                    return;
                  }

                  updateSchedule(selected.id, selected);
                  setSelected(null);
                }}
              >
                Save changes
              </button>

              <button
                className="btn btn-danger"
                onClick={() => setConfirmDelete(true)}
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

            {confirmDelete && (
              <div
                style={{
                  display: 'grid',
                  gap: 8,
                  padding: 12,
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                }}
              >
                <strong>
                  Delete this calendar session?
                </strong>

                <span className="muted">
                  This action cannot be undone.
                </span>

                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                  }}
                >
                  <button
                    className="btn btn-danger"
                    onClick={handleDelete}
                  >
                    Yes, delete
                  </button>

                  <button
                    className="btn btn-soft"
                    onClick={() =>
                      setConfirmDelete(false)
                    }
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {add && (
        <Modal
          title="Add to calendar"
          onClose={() => setAdd(false)}
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();

              const trimmedTitle = title.trim();

              if (
                !trimmedTitle ||
                mins(end) <= mins(start)
              ) {
                return;
              }

              const chosen = new Date(
                `${date}T00:00:00`,
              );

              addSchedule({
                title: trimmedTitle,
                day: chosen.getDay(),
                date,
                start,
                end,
                kind: 'study',
                color: '#54a580',
                location: 'Calendar session',
              });

              resetAddForm();
              setAdd(false);
            }}
            style={{
              display: 'grid',
              gap: 12,
            }}
          >
            <input
              autoFocus
              className="input"
              placeholder="Class, study session, or event"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
            />

            <input
              className="input"
              type="date"
              value={date}
              onChange={(event) =>
                setDate(event.target.value)
              }
            />

            <div
              style={{
                display: 'flex',
                gap: 10,
              }}
            >
              <input
                className="input"
                type="time"
                value={start}
                onChange={(event) =>
                  setStart(event.target.value)
                }
              />

              <input
                className="input"
                type="time"
                value={end}
                onChange={(event) =>
                  setEnd(event.target.value)
                }
              />
            </div>

            <button
              className="btn btn-primary"
              type="submit"
            >
              Add to calendar
            </button>
          </form>
        </Modal>
      )}
    </Page>
  );
}

function WeekGrid({
  dates,
  today,
  schedule,
  tasks,
  onEdit,
  onMove,
}: {
  dates: Date[];
  today: string;
  schedule: ScheduleItem[];
  tasks: Array<{
    id: string;
    title: string;
    due?: string;
    status?: string;
  }>;
  onEdit: (item: ScheduleItem) => void;
  onMove: (
    id: string,
    changes: Partial<ScheduleItem>,
  ) => void;
}) {
  const now = new Date();
  const current =
    now.getHours() * 60 + now.getMinutes();

  return (
    <div className="card timetable-card">
      <div
        className="timetable-grid"
        style={{
          minHeight: `${24 * HOUR_HEIGHT + 50}px`,
        }}
      >
        <div className="timetable-head">
          <div />

          {dates.map((date, index) => (
            <div
              key={localDate(date)}
              className={
                'day-head ' +
                (localDate(date) === today
                  ? 'today'
                  : '')
              }
            >
              {names[index]}

              <div>{date.getDate()}</div>
            </div>
          ))}
        </div>

        <div
          className="timetable-body"
          style={{
            height: `${24 * HOUR_HEIGHT}px`,
            minHeight: `${24 * HOUR_HEIGHT}px`,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <div
            className="timetable-hours"
            aria-hidden="true"
          >
            {Array.from(
              { length: 24 },
              (_, hour) => (
                <span
                  className="hour"
                  key={hour}
                  style={{
                    top: hour * HOUR_HEIGHT,
                  }}
                >
                  {String(hour).padStart(2, '0')}:00
                </span>
              ),
            )}
          </div>

          <div
            className="timetable-events"
            style={{
              position: 'relative',
              height: `${24 * HOUR_HEIGHT}px`,
            }}
          >
            {Array.from(
              { length: 25 },
              (_, hour) => (
                <div
                  key={`line-${hour}`}
                  style={{
                    position: 'absolute',
                    top: hour * HOUR_HEIGHT,
                    left: 56,
                    right: 0,
                    borderTop:
                      '1px solid var(--border)',
                    pointerEvents: 'none',
                  }}
                />
              ),
            )}

            {schedule.map((item) => {
              const eventDate = getEventDate(
                item,
                dates[0],
              );

              const column = dates.findIndex(
                (date) =>
                  localDate(date) === eventDate,
              );

              if (column < 0) return null;

              const startMinutes = mins(item.start);
              const endMinutes = Math.min(
                DAY_END,
                mins(item.end),
              );

              const isNow =
                localDate(dates[column]) === today &&
                startMinutes <= current &&
                endMinutes > current;

              return (
                <EventBlock
                  key={item.id}
                  item={item}
                  col={column}
                  dates={dates}
                  active={isNow}
                  onEdit={onEdit}
                  onMove={onMove}
                />
              );
            })}

            {tasks
              .filter(
                (task) =>
                  task.due &&
                  dates.some(
                    (date) =>
                      localDate(date) === task.due,
                  ) &&
                  task.status !== 'done',
              )
              .map((task) => {
                const column = dates.findIndex(
                  (date) =>
                    localDate(date) === task.due,
                );

                return (
                  <div
                    className="calendar-task"
                    key={task.id}
                    style={{
                      position: 'absolute',
                      left: `calc(56px + (100% - 56px) / 7 * ${column})`,
                    }}
                  >
                    • {task.title}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

function EventBlock({
  item,
  col,
  dates,
  active,
  onEdit,
  onMove,
}: {
  item: ScheduleItem;
  col: number;
  dates: Date[];
  active: boolean;
  onEdit: (item: ScheduleItem) => void;
  onMove: (
    id: string,
    changes: Partial<ScheduleItem>,
  ) => void;
}) {
  const startMinutes = mins(item.start);
  const endMinutes = Math.min(
    DAY_END,
    mins(item.end),
  );

  const top =
    startMinutes * PIXELS_PER_MINUTE;

  const height = Math.max(
    (endMinutes - startMinutes) *
      PIXELS_PER_MINUTE,
    34,
  );

  const [offset, setOffset] = useState({
    x: 0,
    y: 0,
  });

  const drag = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    grabOffsetY: number;
    body: HTMLElement;
    moved: boolean;
  } | null>(null);

  const ignoreClick = useRef(false);

  const beginDrag = (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    if (event.button !== 0) return;

    const body =
      event.currentTarget.closest(
        '.timetable-body',
      );

    if (!(body instanceof HTMLElement)) return;

    const bounds =
      event.currentTarget.getBoundingClientRect();

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );

    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      grabOffsetY:
        event.clientY - bounds.top,
      body,
      moved: false,
    };
  };

  const moveDrag = (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    const current = drag.current;

    if (
      !current ||
      current.pointerId !== event.pointerId
    ) {
      return;
    }

    const deltaX =
      event.clientX - current.startX;

    const deltaY =
      event.clientY - current.startY;

    if (
      Math.abs(deltaX) > 4 ||
      Math.abs(deltaY) > 4
    ) {
      current.moved = true;
    }

    if (current.moved) {
      setOffset({
        x: deltaX,
        y: deltaY,
      });
    }
  };

  const finishDrag = (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    const current = drag.current;

    if (
      !current ||
      current.pointerId !== event.pointerId
    ) {
      return;
    }

    drag.current = null;
    setOffset({ x: 0, y: 0 });

    if (!current.moved) return;

    ignoreClick.current = true;

    window.setTimeout(() => {
      ignoreClick.current = false;
    }, 0);

    const bounds =
      current.body.getBoundingClientRect();

    const columnWidth =
      (bounds.width - 56) / 7;

    const nextColumn = Math.max(
      0,
      Math.min(
        6,
        Math.floor(
          (event.clientX -
            bounds.left -
            56) /
            columnWidth,
        ),
      ),
    );

    const duration =
      endMinutes - startMinutes;

    const dropTop =
      event.clientY -
      bounds.top +
      current.body.scrollTop -
      current.grabOffsetY;

    // Snap to 30 minutes.
    const snappedStart =
      Math.round(
        dropTop /
          (30 * PIXELS_PER_MINUTE),
      ) *
      30;

    const nextStart = Math.max(
      DAY_START,
      Math.min(
        DAY_END - duration,
        snappedStart,
      ),
    );

    const nextDate = dates[nextColumn];

    onMove(item.id, {
      day: nextDate.getDay(),
      start: timeFromMinutes(nextStart),
      end: timeFromMinutes(
        nextStart + duration,
      ),
      ...(item.date
        ? {
            date: localDate(nextDate),
          }
        : {}),
    });
  };

  return (
    <button
      type="button"
      onPointerDown={beginDrag}
      onPointerMove={moveDrag}
      onPointerUp={finishDrag}
      onPointerCancel={() => {
        drag.current = null;
        setOffset({ x: 0, y: 0 });
      }}
      onClick={() => {
        if (!ignoreClick.current) {
          onEdit(item);
        }
      }}
      className={
        'timetable-event ' +
        (active ? 'active ' : '')
      }
      style={{
        position: 'absolute',
        left: `calc(56px + (100% - 56px) / 7 * ${col})`,
        top,
        width:
          'calc((100% - 56px) / 7 - 8px)',
        height,
        borderColor: item.color,
        background: `${item.color}26`,
        transform:
          offset.x || offset.y
            ? `translate(${offset.x}px, ${offset.y}px) scale(1.03)`
            : undefined,
      }}
    >
      <b>{item.title}</b>

      <span>
        {item.start}–{item.end}
      </span>

      {active && <em>Now</em>}
    </button>
  );
}

function DayView({
  date,
  events,
  tasks,
}: {
  date: Date;
  events: ScheduleItem[];
  tasks: Array<{
    id: string;
    title: string;
  }>;
}) {
  return (
    <section className="card day-view">
      <div
        style={{
          maxHeight: '70vh',
          overflowY: 'auto',
        }}
      >
        {Array.from(
          { length: 24 },
          (_, hour) => (
            <div
              className="day-hour"
              key={hour}
            >
              <span>
                {String(hour).padStart(2, '0')}:00
              </span>

              <div>
                {events
                  .filter(
                    (event) =>
                      Math.floor(
                        mins(event.start) / 60,
                      ) === hour,
                  )
                  .map((event) => (
                    <article
                      key={event.id}
                      style={{
                        borderColor: event.color,
                      }}
                    >
                      <b>{event.title}</b>

                      <small>
                        {event.start}–{event.end}
                      </small>
                    </article>
                  ))}
              </div>
            </div>
          ),
        )}
      </div>

      {tasks.length > 0 && (
        <div className="day-tasks">
          <b>
            Tasks due on{' '}
            {new Intl.DateTimeFormat(
              undefined,
              {
                month: 'short',
                day: 'numeric',
              },
            ).format(date)}
          </b>

          {tasks.map((task) => (
            <span key={task.id}>
              • {task.title}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

function MonthView({
  days,
  cursor,
  events,
  tasks,
  onPick,
}: {
  days: Date[];
  cursor: Date;
  events: (date: Date) => ScheduleItem[];
  tasks: Array<{
    id: string;
    title: string;
    due?: string;
  }>;
  onPick: (date: Date) => void;
}) {
  return (
    <section className="card month-view">
      <div className="month-head">
        {names.map((day) => (
          <b key={day}>{day}</b>
        ))}
      </div>

      <div className="month-grid">
        {days.map((date) => {
          const inMonth =
            date.getMonth() === cursor.getMonth() &&
            date.getFullYear() ===
              cursor.getFullYear();

          const items = events(date);

          const due = tasks.filter(
            (task) =>
              task.due === localDate(date),
          );

          return (
            <button
              className={
                !inMonth ? 'muted-day' : ''
              }
              onClick={() => onPick(date)}
              key={localDate(date)}
            >
              <span>{date.getDate()}</span>

              {items
                .slice(0, 2)
                .map((event) => (
                  <i
                    key={event.id}
                    style={{
                      background: event.color,
                    }}
                  >
                    {event.title}
                  </i>
                ))}

              {due
                .slice(0, 1)
                .map((task) => (
                  <em key={task.id}>
                    • {task.title}
                  </em>
                ))}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function Agenda({
  start,
  events,
}: {
  start: Date;
  events: (date: Date) => ScheduleItem[];
}) {
  const days = Array.from(
    { length: 14 },
    (_, index) => addDays(start, index),
  );

  return (
    <section className="card agenda-view">
      {days.map((date) => (
        <div key={localDate(date)}>
          <h3>
            {new Intl.DateTimeFormat(
              undefined,
              {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              },
            ).format(date)}
          </h3>

          {events(date).length ? (
            events(date).map((event) => (
              <article
                key={event.id}
                style={{
                  borderColor: event.color,
                }}
              >
                <b>
                  {event.start} · {event.title}
                </b>

                <span>
                  {event.end} ·{' '}
                  {event.location ||
                    'Scheduled'}
                </span>
              </article>
            ))
          ) : (
            <p className="muted">
              Nothing scheduled
            </p>
          )}
        </div>
      ))}
    </section>
  );
}