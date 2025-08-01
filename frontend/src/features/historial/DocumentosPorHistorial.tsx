import { useState, useEffect } from 'react'
import { CircularProgress, List, ListItem, Typography, Button } from '@mui/material'
import api from '../../utils/axios'

interface Documento {
  doc_id: number
  nombre_doc: string
  url: string
  historial_id: number
  eliminado: boolean
  created_at: string
  updated_at: string
}

export function DocumentosPorHistorial({ historialId }: { historialId: number }) {
  const [docs, setDocs]       = useState<Documento[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string|null>(null)

  useEffect(() => {
    const fetchDocs = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await api.get<{ data: Documento[] }>('/documentos', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        })
        const allDocs = res.data.data
        console.log("all docs", allDocs)
        const filtered = allDocs.filter(d =>
          d.historial_id === historialId &&
          !d.eliminado
        )
        setDocs(filtered)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchDocs()
  }, [historialId])

  const handleDownload = async (docId: number, filename: string) => {
      try {
        console.log("asdads", docId )
        const res = await api.get<Blob>(`/documentos/${docId}`, {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        })
        const url = window.URL.createObjectURL(res.data)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
      } catch (err) {
        console.error('Error descargando', err)
      }
    }


  if (loading) return <CircularProgress size={24} />
  if (error)   return <Typography color="error">Error: {error}</Typography>

  return docs.length > 0 ? (
 <List>
      {docs.map(doc => (
        <ListItem key={doc.doc_id} disableGutters>
          <Button
            variant="text"
            onClick={() => handleDownload(doc.doc_id, doc.nombre_doc)}
          >
            {doc.nombre_doc}
          </Button>
        </ListItem>
      ))}
    </List>
  ) : (
    <Typography variant="body2" fontStyle="italic">
      No hay documentos asociados.
    </Typography>
  )
}
