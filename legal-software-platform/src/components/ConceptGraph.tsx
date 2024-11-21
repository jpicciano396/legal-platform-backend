'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import GraphControls from './GraphControls'
import ConceptTooltip from './ConceptTooltip'
import ExportControls from './ExportControls'
import html2canvas from 'html2canvas'

interface ConceptGraphProps {
  concepts: any[]
  relationships: any[]
  searchQuery?: string
}

export default function ConceptGraph({ concepts, relationships, searchQuery }: ConceptGraphProps) {
  const handleExportPNG = () => {
    html2canvas(svgRef.current).then(canvas => {
      const link = document.createElement('a')
      link.download = 'legal-concepts-map.png'
      link.href = canvas.toDataURL()
      link.click()
    })
  }

  const handleExportSVG = () => {
    const svgData = svgRef.current.outerHTML
    const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'})
    const link = document.createElement('a')
    link.download = 'legal-concepts-map.svg'
    link.href = URL.createObjectURL(svgBlob)
    link.click()
  }

  const handleExportJSON = () => {
    const data = {
      concepts,
      relationships
    }
    const jsonBlob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'})
    const link = document.createElement('a')
    link.download = 'legal-concepts-data.json'
    link.href = URL.createObjectURL(jsonBlob)
    link.click()
  }

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <GraphControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleReset}
          onFilterRelations={setRelationFilter}
          relationTypes={relationTypes}
        />
        <ExportControls 
          onExportPNG={handleExportPNG}
          onExportSVG={handleExportSVG}
          onExportJSON={handleExportJSON}
        />
      </div>
      <svg ref={svgRef} width="600" height="400" className="border rounded" />
      {tooltip && <ConceptTooltip {...tooltip} />}
    </div>
  )
}

