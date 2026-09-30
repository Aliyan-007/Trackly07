import { useMemo, useRef, useState } from 'react';
import { Page } from '../layouts/AppLayout';
import { useTracklyStore } from '../stores/useTracklyStore';
import { Modal } from '../components/ui/Modal';
import { Plus, ChevronLeft, ChevronRight } from '../components/shared/Icons';
import { AISchedule } from '../components/timetable/AISchedule';
import type { ScheduleItem } from '../types';
import { localDate } from '../utils/date';
const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
type View = 'day' | 'week' | 'month' | 'agenda';
const mins = (v: string) => {
  const [a, b] = v.split(':').map(Number);
  return a * 60 + b;
};
const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
const weekStart = (d: Date) => addDays(d, -d.getDay());
const sameEvent = (item: { date?: string; day: number }, date: Date) =>
  item.date ? item.date === localDate(date) : item.day === date.getDay();
export function Timetable() {
  const { schedule, tasks, addSchedule, updateSchedule, deleteSchedule } = useTracklyStore();
  const [view, setView] = useState<View>('week'),
    [cursor, setCursor] = useState(new Date()),
    [add, setAdd] = useState(false),
    [ai, setAi] = useState(false),
    [title, setTitle] = useState(''),
    [date, setDate] = useState(localDate()),
    [start, setStart] = useState('09:00'),
    [end, setEnd] = useState('10:00'),
    [selected, setSelected] = useState<any>(null);
  const today = localDate(),
    week = useMemo(() => names.map((_, i) => addDays(weekStart(cursor), i)), [cursor]);
  const range =
    view === 'month'
      ? new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(cursor)
      : view === 'week'
        ? `${new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(week[0])} — ${new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(week[6])}`
        : new Intl.DateTimeFormat(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          }).format(cursor);
  const move = (amount: number) =>
    setCursor(
      addDays(cursor, view === 'month' ? amount * 30 : view === 'week' ? amount * 7 : amount),
    );
  const visible = (d: Date) =>
    schedule.filter((item) => sameEvent(item, d)).sort((a, b) => mins(a.start) - mins(b.start));
  const calendarDays = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1),
      start = weekStart(first);
    return Array.from({ length: 42 }, (_, i) => addDays(start, i));
  }, [cursor]);
  function setConfirmDelete(arg0: boolean): void {
    throw new Error('Function not implemented.');
  }

  return (
    <Page
      title="Calendar"
      eyebrow={range}
      actions={
        <div className="calendar-actions">
          <button className="btn btn-soft" onClick={() => move(-1)}>
            <ChevronLeft size={16} />
          </button>
          <button className="btn btn-soft" onClick={() => setCursor(new Date())}>
            Today
          </button>
          <button className="btn btn-soft" onClick={() => move(1)}>
            <ChevronRight size={16} />
          </button>
          <button className="btn btn-soft" onClick={() => setAi(true)}>
            Ask AI
          </button>
          <button className="btn btn-primary" onClick={() => setAdd(true)}>
            <Plus size={16} /> Add
          </button>
        </div>
      }
    >
      <div className="calendar-views" role="tablist">
        {(['day', 'week', 'month', 'agenda'] as View[]).map((item) => (
          <button
            role="tab"
            aria-selected={view === item}
            className={view === item ? 'active' : ''}
            key={item}
            onClick={() => setView(item)}
          >
            {item === 'agenda' ? 'Hours' : item[0].toUpperCase() + item.slice(1)}
          </button>
        ))}
      </div>
      {view === 'week' && (
        <WeekGrid
          dates={week}
          today={today}
          schedule={schedule}
          tasks={tasks}
          onEdit={setSelected}
          onMove={(id, changes) => updateSchedule(id, changes)}
        />
      )}{' '}
      {view === 'day' && (
        <DayView
          events={visible(cursor)}
          tasks={tasks.filter((t) => t.due === localDate(cursor))}
        />
      )}{' '}
      {view === 'month' && (
        <MonthView
          days={calendarDays}
          cursor={cursor}
          events={visible}
          tasks={tasks}
          onPick={(d) => {
            setCursor(d);
            setView('day');
          }}
        />
      )}{' '}
      {view === 'agenda' && <Agenda start={cursor} events={visible} />}{' '}
      {ai && <AISchedule onClose={() => setAi(false)} />}{' '}
      {selected && (
        <Modal title="Edit calendar session" onClose={() => setSelected(null)}>
          <div style={{ display: 'grid', gap: 12 }}>
            <input
              className="input"
              value={selected.title}
              onChange={(e) => setSelected({ ...selected, title: e.target.value })}
            />
            <input
              className="input"
              type="date"
              value={selected.date || localDate(addDays(weekStart(cursor), selected.day))}
              onChange={(e) => {
                const d = new Date(`${e.target.value}T00:00:00`);
                setSelected({ ...selected, date: e.target.value, day: d.getDay() });
              }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                className="input"
                type="time"
                value={selected.start}
                onChange={(e) => setSelected({ ...selected, start: e.target.value })}
              />
              <input
                className="input"
                type="time"
                value={selected.end}
                onChange={(e) => setSelected({ ...selected, end: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="btn btn-primary"
                onClick={() => {
                  updateSchedule(selected.id, selected);
                  setSelected(null);
                }}
              >
                Save changes
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
      )}{' '}
      {add && (
        <Modal title="Add to calendar" onClose={() => setAdd(false)}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (title) {
                const chosen = new Date(`${date}T00:00:00`);
                addSchedule({
                  title,
                  day: chosen.getDay(),
                  date,
                  start,
                  end,
                  kind: 'study',
                  color: '#54a580',
                  location: 'Calendar session',
                });
                setAdd(false);
              }
            }}
            style={{ display: 'grid', gap: 12 }}
          >
            <input
              autoFocus
              className="input"
              placeholder="Class, study session, or event"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <input
              className="input"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                className="input"
                type="time"
                value={start}
                onChange={(event) => setStart(event.target.value)}
              />
              <input
                className="input"
                type="time"
                value={end}
                onChange={(event) => setEnd(event.target.value)}
              />
            </div>
            <button className="btn btn-primary">Add to calendar</button>
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
  schedule: any[];
  tasks: any[];
  onEdit: (item: any) => void;
  onMove: (id: string, changes: Partial<ScheduleItem>) => void;
}) {
  const now = new Date(),
    current = now.getHours() * 60 + now.getMinutes();
  return (
    <div className="card timetable-card">
      <div className="timetable-grid">
        <div className="timetable-head">
          <div />
          {dates.map((d, i) => (
            <div
              key={localDate(d)}
              className={'day-head ' + (localDate(d) === today ? 'today' : '')}
            >
              {names[i]}
              <div>{d.getDate()}</div>
            </div>
          ))}
        </div>
        <div className="timetable-body">
          {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24].map((hour) => (
            <span className="hour" key={hour} style={{ top: (hour - 8) * 66 }}>
              {hour}:00
            </span>
          ))}
          {schedule.map((item) => {
            const col = item.date ? dates.findIndex((d) => localDate(d) === item.date) : item.day;
            if (col < 0) return null;
            const isNow =
              localDate(dates[col]) === today &&
              mins(item.start) <= current &&
              mins(item.end) > current;
            return (
              <EventBlock
                key={item.id}
                item={item}
                col={col}
                dates={dates}
                active={isNow}
                onEdit={onEdit}
                onMove={onMove}
              />
            );
          })}
          {tasks
            .filter(
              (t) => t.due && dates.some((d) => localDate(d) === t.due) && t.status !== 'done',
            )
            .map((t) => {
              const col = dates.findIndex((d) => localDate(d) === t.due);
              return (
                <div
                  className="calendar-task"
                  key={t.id}
                  style={{ left: `calc(56px + (100% - 56px)/7 * ${col})` }}
                >
                  • {t.title}
                </div>
              );
            })}
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
  item: any;
  col: number;
  dates: Date[];
  active: boolean;
  onEdit: (item: any) => void;
  onMove: (id: string, changes: Partial<ScheduleItem>) => void;
}) {
  const top = (mins(item.start) - 480) * 1.1,
    height = (mins(item.end) - mins(item.start)) * 1.1;
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    grabOffsetY: number;
    body: HTMLElement;
    moved: boolean;
  } | null>(null);
  const ignoreClick = useRef(false);
  const beginDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    const body = event.currentTarget.closest('.timetable-body');
    if (!(body instanceof HTMLElement)) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      grabOffsetY: event.clientY - bounds.top,
      body,
      moved: false,
    };
  };
  const moveDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - current.startX;
    const deltaY = event.clientY - current.startY;
    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) current.moved = true;
    if (current.moved) setOffset({ x: deltaX, y: deltaY });
  };
  const finishDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    drag.current = null;
    setOffset({ x: 0, y: 0 });
    if (!current.moved) return;

    ignoreClick.current = true;
    window.setTimeout(() => {
      ignoreClick.current = false;
    }, 0);

    const bounds = current.body.getBoundingClientRect();
    const columnWidth = (bounds.width - 56) / 7;
    const nextColumn = Math.max(
      0,
      Math.min(6, Math.floor((event.clientX - bounds.left - 56) / columnWidth)),
    );
    const duration = mins(item.end) - mins(item.start);
    const dropTop = event.clientY - bounds.top - current.grabOffsetY;
    const snappedStart = 480 + Math.round(dropTop / 33) * 30;
    const nextStart = Math.max(480, Math.min(960 - duration, snappedStart));
    const nextDate = dates[nextColumn];
    const toTime = (minutes: number) =>
      `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

    onMove(item.id, {
      day: nextDate.getDay(),
      start: toTime(nextStart),
      end: toTime(nextStart + duration),
      ...(item.date ? { date: localDate(nextDate) } : {}),
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
        if (!ignoreClick.current) onEdit(item);
      }}
      className={'timetable-event ' + (active ? 'active ' : '') }
      style={{
        left: `calc(56px + (100% - 56px)/7 * ${col})`,
        top,
        width: 'calc((100% - 56px)/7 - 8px)',
        height: Math.max(height, 34),
        borderColor: item.color,
        background: item.color + '26',
        transform:
          offset.x || offset.y ? `translate(${offset.x}px, ${offset.y}px) scale(1.03)` : undefined,
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
function DayView({ events, tasks }: { events: any[]; tasks: any[] }) {
  return (
    <section className="card day-view">
      {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((hour) => (
        <div className="day-hour" key={hour}>
          <span>{hour}:00</span>
          <div>
            {events
              .filter((x) => Math.floor(mins(x.start) / 60) === hour)
              .map((x) => (
                <article key={x.id} style={{ borderColor: x.color }}>
                  <b>{x.title}</b>
                  <small>
                    {x.start}–{x.end}
                  </small>
                </article>
              ))}
          </div>
        </div>
      ))}
      {tasks.length > 0 && (
        <div className="day-tasks">
          <b>Tasks due today</b>
          {tasks.map((t) => (
            <span key={t.id}>• {t.title}</span>
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
  events: (d: Date) => any[];
  tasks: any[];
  onPick: (d: Date) => void;
}) {
  return (
    <section className="card month-view">
      <div className="month-head">
        {names.map((d) => (
          <b key={d}>{d}</b>
        ))}
      </div>
      <div className="month-grid">
        {days.map((d) => {
          const inMonth = d.getMonth() === cursor.getMonth(),
            items = events(d),
            due = tasks.filter((t) => t.due === localDate(d));
          return (
            <button
              className={!inMonth ? 'muted-day' : ''}
              onClick={() => onPick(d)}
              key={localDate(d)}
            >
              <span>{d.getDate()}</span>
              {items.slice(0, 2).map((x) => (
                <i key={x.id} style={{ background: x.color }}>
                  {x.title}
                </i>
              ))}
              {due.slice(0, 1).map((x) => (
                <em key={x.id}>• {x.title}</em>
              ))}
            </button>
          );
        })}
      </div>
    </section>
  );
}
function Agenda({ start, events }: { start: Date; events: (d: Date) => any[] }) {
  const days = Array.from({ length: 14 }, (_, i) => addDays(start, i));
  return (
    <section className="card agenda-view">
      {days.map((d) => (
        <div key={localDate(d)}>
          <h3>
            {new Intl.DateTimeFormat(undefined, {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            }).format(d)}
          </h3>
          {events(d).length ? (
            events(d).map((x) => (
              <article key={x.id} style={{ borderColor: x.color }}>
                <b>
                  {x.start} · {x.title}
                </b>
                <span>
                  {x.end} · {x.location || 'Scheduled'}
                </span>
              </article>
            ))
          ) : (
            <p className="muted">Nothing scheduled</p>
          )}
        </div>
      ))}
    </section>
  );
}
