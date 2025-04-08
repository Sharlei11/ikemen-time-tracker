import { useState, useEffect } from "react";
import { Card, CardContent } from "@/card";
import { format, parse, utcToZonedTime } from "date-fns-tz";
import { differenceInSeconds, addHours, isAfter } from "date-fns";
const jst = "Asia/Tokyo";
const local = "Australia/Melbourne";
const games = [
  {
    name: "Ikémen Sengoku",
    luckyTimes: ["07:00", "19:00"],
    ticketRefresh: ["04:00", "12:00", "20:00"],
  },
  {
    name: "Ikémen Villains",
    luckyTimes: ["06:00", "18:00"],
    ticketRefresh: ["09:00"],
  },
  {
    name: "Ikémen Vampire",
    luckyTimes: ["08:00", "20:00"],
    ticketRefresh: ["05:00", "13:00", "21:00"],
  },
  {
    name: "Ikémen Prince",
    luckyTimes: ["06:30", "18:30"],
    ticketRefresh: ["09:00"],
  },
  {
    name: "Ikémen Revolution",
    luckyTimes: ["07:30", "19:30"],
    ticketRefresh: ["08:00", "16:00"],
  },
];
function convertToLocal(timeStr) {
  const jstDate = parse(timeStr, "HH:mm", new Date());
  const zonedDate = utcToZonedTime(jstDate, jst);
  return format(zonedDate, "hh:mm a (zzz)", { timeZone: local });
}
function getCountdownTime(timeStr) {
  const now = new Date();
  let jstTarget = parse(timeStr, "HH:mm", new Date());
  if (isAfter(now, jstTarget)) jstTarget = addHours(jstTarget, 24);
  const targetZoned = utcToZonedTime(jstTarget, jst);
  const diff = differenceInSeconds(targetZoned, now);
  const hrs = Math.floor(diff / 3600);
  const mins = Math.floor((diff % 3600) / 60);
  const secs = diff % 60;
  return `${hrs}h ${mins}m ${secs}s`;
}
export default function IkemenTimeTracker() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Ikémen Time Tracker</h1>
      {games.map((game) => (
        <Card key={game.name} className="border shadow-sm">
          <CardContent className="p-4 space-y-4">
            <h2 className="text-xl font-semibold">{game.name}</h2>
            <div>
              <p className="font-medium">Lucky Times (Melbourne Time):</p>
              <ul className="list-disc list-inside">
                {game.luckyTimes.map((t, i) => (
                  <li key={i}>
                    {convertToLocal(t)} – <span className="text-sm text-muted-foreground">Starts in {getCountdownTime(t)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-medium">Ticket Refresh Times (Melbourne Time):</p>
              <ul className="list-disc list-inside">
                {game.ticketRefresh.map((t, i) => (
                  <li key={i}>
                    {convertToLocal(t)} – <span className="text-sm text-muted-foreground">In {getCountdownTime(t)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}