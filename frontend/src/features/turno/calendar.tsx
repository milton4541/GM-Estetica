import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import useTurnos from "./hooks/useTurnos";
import AddTurno from "./AddTurno";
import type { DateClickArg } from "@fullcalendar/interaction";
import type { EventClickArg } from "@fullcalendar/core/index.js";
import type { Turno } from "./types/Turno";
import DetailModal from "./DetailModal";

const CalendarPage = () => {
  const { events, loading, refresh, addTurno,deleteTurno, updateTurno,finaliceTurno } = useTurnos();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null);

  const handleDateClick = (arg: DateClickArg) => {
    setSelectedDate(arg.dateStr);
    setIsModalOpen(true);
  };

  const handleEventClick = (arg: EventClickArg) => {
  const turno = arg.event.extendedProps.rawTurno as Turno;
  setSelectedTurno(turno);
  setDetailOpen(true);
};
  
  if (loading) return <p>Cargando turnos…</p>;

  return (
    
    <div className="container mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Calendario</h1>
      <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      events={events}
      dateClick={handleDateClick}    
      eventClick={handleEventClick}           
      editable={true}
      selectable={true}
      locale="es"
      buttonText={{
        today: "Hoy",
        month: "Mes",
        week: "Semana",
        day: "Día",
      }}
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      }}
      slotDuration="00:30:00"
      slotLabelInterval="00:30:00"
      slotLabelFormat={{
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }}
      slotMinTime="06:00:00"
      slotMaxTime="22:00:00"
      height="auto"
    />
    {isModalOpen && (
       <AddTurno
          onClose={() => setIsModalOpen(false)}
          selectedDate={selectedDate}
          addTurno={addTurno}
        />
      )}

      {selectedTurno && (
  <DetailModal
    turno={selectedTurno}
    isOpen={detailOpen}
    onClose={() => {
      setDetailOpen(false);
      setSelectedTurno(null);
      refresh(); 
    }}
    onSave={updateTurno}
    onDelete={deleteTurno}
    onFinalize={finaliceTurno}
  />
)}
    </div>
  );
};

export default CalendarPage;