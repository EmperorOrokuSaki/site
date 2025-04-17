"use client"
import { Film } from "lucide-react"

// Mock data for favorite films - in a real app, you would fetch this from the Letterboxd API
const favoriteFilms = [
  { title: "A Clockwork Orange", director: "Stanley Kubrick" },
  { title: "Stalker", director: "Andrei Tarkovsky" },
  { title: "Dogville", director: "Lars von Trier" },
  { title: "Blade Runner 2049", director: "Denis Villeneuve" },
]

export function FavoriteFilms() {
  return (
    <div className="border border-green-700 p-4">
      <h3 className="text-green-300 mb-2 text-sm flex items-center gap-2">
        <Film className="h-3 w-3" />
        <span>$ ls films/favorites/</span>
      </h3>
      <ul className="space-y-1 text-xs">
        {favoriteFilms.map((film, index) => (
          <li key={index}>
            {film.title} <span className="text-green-600">// {film.director}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 text-right">
        <a
          href="https://letterboxd.com/nimara/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-green-300 hover:underline"
        >
          view all →
        </a>
      </div>
    </div>
  )
}
