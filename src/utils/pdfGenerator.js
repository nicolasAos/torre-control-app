import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';

const generatePdf = async(
  datos = {
    tipo: '',
    no_planilla: '',
    remesa: '',
    travel_id: '',
    destination_order: '',
  },
  photoArr = []
) => {
  const pdfHtml = `
    <div 
    style="
      width: 95%; 
      padding: 10px;  
      margin-top: 5px;
      margin-bottom: 5px;"
    >
      <div
        style="width: 100%; display: flex; justify-content: flex-end; padding: 10px; background-color: #1F2B52;"
      >
        <img
          src="https://res.cloudinary.com/scute/image/upload/v1641840166/solistica-logo_slxrxj.png"
          style="width: 80px; height: 30px;"
        />
      </div>
      <div
        style="
          width: 100%; 
          border: 2px solid black; 
          padding: 10px; 
          border-radius: 5px; 
          display: flex; 
          flex-direction: row; 
          margin-top: 5px;
          margin-bottom: 5px"
      >
        <div style="flex: 1;">
          <p>
            Tipo Pedido: ${datos.tipo}
          </p>
          <p>
            Numero Planilla: ${datos.no_planilla}
          </p>
          <p>
            Viaje: ${datos.travel_id}
          </p>
        </div>
        <div style="flex: 1;">
          <p>
            Remesa: ${datos.remesa}
          </p>
          <p>
            Destino: ${datos.destination_order}
          </p>
        </div>
      </div>
      ${generatePdfColumns(photoArr)}
    </div>
  `
  const options = {
    html: pdfHtml,
    fileName: 'pedido',
    padding: 0
  }

  let file = await RNHTMLtoPDF.convert(options)
  FileViewer.open(file.filePath)
  return {
    name: `${datos.remesa}.pdf`, 
    uri: `file://${file.filePath}`,
    type: 'application/pdf'
  }
}

const generatePdfColumns = (photoArr = []) => {
  let endDiv = ''
  photoArr.map((item, index) => {
    endDiv = endDiv + `
      <div 
      style="
        width: 100%; 
        padding: 10px; 
        display: flex;
        flex-direction: column;
        margin-top: 5px;
        align-items: center;
        "
      >
        <img
          src="${item.uri}"
          style="width: 100%; border-radius: 5px; max-height: 600px;"
        />
        <div
          style="
            width: 100%; 
            border: 2px solid black; 
            padding: 5px; 
            border-radius: 5px; 
            display: flex; 
            flex-direction: row; 
            margin-bottom: 3px";
        >
          <div>
            <p>
              Tipo evidencia: ${item.evidence_type ? item.evidence_type : 'Extra imagen'}
            </p>
            <p>
              Tipo Archivo: ${item.name}
            </p>
            <p>
              Numero de Evidencia: ${index + 1}
            </p>
          </div>
        </div>
      </div>
    `
  })
  return endDiv 
}

export default generatePdf
