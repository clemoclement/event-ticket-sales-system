import { Link } from "react-router-dom";
import { kes, dateShort } from "../format.js";

function EventCard({ e }) {
  return (
    <Link to={`/events/${e.id}`} className="card block p-4 hover:border-primary">
      <h3 className="text-lg font-semibold">{e.title}</h3>
      <p className="text-sm text-muted">
        {dateShort(e.starts_at)} · {e.venue}
      </p>
      <p className="mt-2 font-medium">From {kes(e.from_price)}</p>
    </Link>
  );
}

export default EventCard;
