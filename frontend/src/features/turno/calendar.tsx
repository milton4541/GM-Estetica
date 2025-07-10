import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // Para eventos de interacción


//crear utilidad para manejar eventos
const CalendarPage = () => {
  const [events, setEvents] = useState([
    {
      title: "Reunión con el equipo",
      start: "2025-01-10T10:00:00",
      end: "2025-01-10T11:00:00",
    },
    {
      title: "Cita con cliente",
      start: "2025-01-11T14:00:00",
    },
  ]);

  const handleDateClick = (arg: any) => {
    const title = prompt("Introduce un título para el evento:");
    if (title) {
      setEvents([
        ...events,
        {
          title,
          start: arg.dateStr,
          //allDay: arg.allDay,
        },
      ]);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Calendario</h1>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick} // Maneja clics en fechas vacías
        editable={true} // Permite arrastrar y soltar eventos
        selectable={true} // Permite seleccionar rangos de fechas
        locale="es" // Idioma
        buttonText={{
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
            allday: "Todo el día",
          }}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        slotDuration="00:30:00" // Mostrar intervalos de 30 minutos
        slotLabelInterval="00:30:00" // Etiquetas cada 30 minutos
        slotLabelFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false, // Formato 24 horas, cambia a true para 12 horas
        }}
        height="auto"
      />
    </div>
  );
};

export default CalendarPage;