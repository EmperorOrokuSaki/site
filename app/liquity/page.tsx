import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Liquity",
}

async function fetchLiquityHTML() {
  try {
    const response = await fetch(
      "https://fmja5vvgx5vfveeb.public.blob.vercel-storage.com/liquity-Zl6KkvD4y8NpWeOqlGxM2tuwUpzypH.html",
      {
        cache: "no-store",
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`)
    }

    return await response.text()
  } catch (error) {
    console.error("Error fetching Liquity HTML:", error)
    return null
  }
}

export default async function LiquityPage() {
  const htmlContent = await fetchLiquityHTML()

  if (!htmlContent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Technical Difficulty</h1>
          <p>Unable to load the page content.</p>
        </div>
      </div>
    )
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      style={{
        width: "100%",
        height: "100vh",
        margin: 0,
        padding: 0,
      }}
    />
  )
}
