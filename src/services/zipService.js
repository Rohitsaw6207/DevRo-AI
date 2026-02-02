import JSZip from 'jszip'
import { saveAs } from 'file-saver'

/**
 * Download project as ZIP
 * @param {Array<{path: string, content: string}>} files
 */
export async function downloadZip(files) {
  if (!Array.isArray(files) || files.length === 0) {
    throw new Error('No files to download')
  }

  const zip = new JSZip()

  files.forEach(({ path, content }) => {
    // Ensure folder paths work correctly
    zip.file(path, content)
  })

  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  })

  saveAs(blob, 'devro-project.zip')
}
