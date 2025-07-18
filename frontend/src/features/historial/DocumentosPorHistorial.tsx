import { Button } from "@mui/material"
import { useState } from "react"

export function DocumentosPorHistorial({ historialId }) {
  const [docs, setDocs] = useState([])
  const [file, setFile] = useState(null)

  const handleUpload = async () => {

  }

  return (
    <div>
      {/* Subir nuevo documento */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="file"
          onChange={e => setFile(e.target.files[0])}
        />
        <Button
          variant="contained"
          disabled={!file}
          onClick={handleUpload}
        >
          Subir documento
        </Button>
      </div>

      {/* Lista de documentos existentes */}
      <ul className="list-disc list-inside space-y-1">
        {docs.map(doc => (
          <li key={doc.id_documento}>
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              download={doc.filename}
              className="text-blue-600 hover:underline"
            >
              {doc.filename}
            </a>
          </li>
        ))}
        {docs.length === 0 && <li className="italic">No hay documentos.</li>}
      </ul>
    </div>
  )
}
