import React, { useState } from 'react';
import AWS from 'aws-sdk';

// Configuração das credenciais da AWS
AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();
const bucketName = 'fotos-projeto-145'; // Nome do bucket S3

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileUpload = async () => {
    if (!selectedFile) {
      console.log('Nenhum arquivo selecionado.');
      return;
    }

    const fileName = selectedFile.name;
    const uploadParams = {
      Bucket: bucketName,
      Key: fileName,
      Body: selectedFile,
    };

    try {
      await s3.upload(uploadParams).promise();
      console.log('Arquivo enviado com sucesso.');
    } catch (error) {
      console.error('Erro ao enviar arquivo:', error);
    }
  };

  const handleFileDownload = async () => {
    const fileName = 'nome-do-arquivo'; // Nome do arquivo no S3

    const downloadParams = {
      Bucket: bucketName,
      Key: fileName,
    };

    try {
      const data = await s3.getObject(downloadParams).promise();
      // Aqui você pode tratar a resposta do download, por exemplo:
      console.log('Dados do arquivo:', data);
    } catch (error) {
      console.error('Erro ao baixar o arquivo:', error);
    }
  };

  const handleListObjects = async () => {
    const listParams = {
      Bucket: bucketName,
    };

    try {
      const data = await s3.listObjectsV2(listParams).promise();
      // Aqui você pode tratar a resposta da listagem, por exemplo:
      console.log('Objetos no bucket:', data.Contents);
    } catch (error) {
      console.error('credenciais+'+process.env.REACT_APP_AWS_ACCESS_KEY_ID)
      console.error('Erro ao listar objetos:', error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <div>
      <h1>Exemplo de Upload e Download de Arquivos com AWS SDK</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>
      <button onClick={handleFileDownload}>Download</button>
      <button onClick={handleListObjects}>Listar Objetos</button>
    </div>
  );
};

export default App;
