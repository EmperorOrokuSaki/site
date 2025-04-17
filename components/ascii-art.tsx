"use client"

export function AsciiArt({ art }: { art: string }) {
  return (
    <div className="flex justify-center">
      <pre className="text-green-500 whitespace-pre overflow-x-auto" style={{ fontSize: "4px", lineHeight: "1" }}>
        {art}
      </pre>
    </div>
  )
}
