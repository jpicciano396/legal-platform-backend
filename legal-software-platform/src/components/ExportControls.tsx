interface ExportControlsProps {
  onExportPNG: () => void
  onExportSVG: () => void
  onExportJSON: () => void
}

export default function ExportControls({ onExportPNG, onExportSVG, onExportJSON }: ExportControlsProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onExportPNG}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Export PNG
      </button>
      <button
        onClick={onExportSVG}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Export SVG
      </button>
      <button
        onClick={onExportJSON}
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        Export JSON
      </button>
    </div>
  )
}

