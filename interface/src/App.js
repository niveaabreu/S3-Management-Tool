import React, { useEffect,useState } from 'react';
import AWS from 'aws-sdk';
import './App.css';

// Configuração das credenciais da AWS
AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();
const bucketName = 'bucketname3212'; // Nome do bucket S3
const bucketfotosName = 'bucketfotos3212'; // Nome do bucket S3
const websiteName = 'bucketwebsite3212'; // Nome do bucket S3

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [objects, setObjects] = useState([]);
  const [fotos, setFotos] = useState([]);
  const [siteObjetcs, setSiteObjetcs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState('');
  const [userName, setUserName] = useState('');

// ============REFRESH itens no bucket a cada novo upload
  const refreshItems = async () => {
    handleListObjects();
    handleListObjectsFotos();
    handleListObjectsWebsite();
  }

  useEffect(() => {
    refreshItems();
  }, [selectedFile]);
// ============Gerencia credenciais do usuário no browser
  useEffect(() => {
    const VerifyLoggin = async () => {
      let cred = getCredentials();
      console.log(cred);
      if (cred.username === null){
        setShowModal(true);
      }
      else{
        setShowModal(false);
        setUserName(cred.username);
      }
    }
    VerifyLoggin().catch(console.error);
  }, []);

  const logout = () => {
    setUser('');
    saveCredentials();
    setShowModal(true)
  };

  const refresh = () => window.location.reload(true)

  const saveCredentials = () => {
    let username = user;
    if (user.length === 0){
      username = null;
    }
    const credentials = {
      username
    };
    localStorage.setItem('credentials', JSON.stringify(credentials));
  };
  
  const getCredentials = () => {
    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      return JSON.parse(credentials);
    }
    return null;
  };

  const handleModal = () => {
    setShowModal(!showModal);
  };

// =================UPLOAD nos BUCKETS==================
  const handleFileUpload = async () => {
    if (!selectedFile) {
      console.log('Nenhum arquivo selecionado.');
      return;
    }
    const fileName = selectedFile.name;
    const uploadParams = {
      Bucket: bucketName,
      Key: userName+"/" + fileName,
      Body: selectedFile,
    };

    try {
      await s3.upload(uploadParams).promise();
      console.log('Arquivo enviado com sucesso.');
    } catch (error) {
      console.error('Erro ao enviar arquivo:', error);
    }
  };

  const handleFileUploadFotos = async () => {
    if (!selectedFile) {
      console.log('Nenhum arquivo selecionado.');
      return;
    }
    const fileName = selectedFile.name;
    const uploadParams = {
      Bucket: bucketfotosName,
      Key: userName+"/" + fileName,
      Body: selectedFile,
    };

    try {
      await s3.upload(uploadParams).promise();
      console.log('Arquivo enviado com sucesso.');
    } catch (error) {
      console.error('Erro ao enviar arquivo:', error);
    }
  };

  const handleFileUploadWebsite = async () => {
    if (!selectedFile) {
      console.log('Nenhum arquivo selecionado.');
      return;
    }
    const fileName = selectedFile.name;
    const uploadParams = {
      Bucket: websiteName,
      Key: userName+"/" + fileName,
      Body: selectedFile,
    };

    try {
      await s3.upload(uploadParams).promise();
      console.log('Arquivo enviado com sucesso.');
    } catch (error) {
      console.error('Erro ao enviar arquivo:', error);
    }
  };
// =================DOWNLOAD dos BUCKETS==================
  const handleFileDownload = async (fileName) => {
    const downloadParams = {
      Bucket: bucketName,
      Key: fileName,
    };

    try {
      const data = await s3.getObject(downloadParams).promise();
      console.log('Dados do arquivo:', data);
      const fileBlob = new Blob([data.Body]);
      const fileUrl = URL.createObjectURL(fileBlob);
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(fileUrl);
    } catch (error) {
      console.error('Erro ao baixar o arquivo:', error);
    }
  };

  const handleFileDownloadFotos = async (fileName) => {
    const downloadParams = {
      Bucket: bucketfotosName,
      Key: fileName,
    };

    try {
      const data = await s3.getObject(downloadParams).promise();
      console.log('Dados do arquivo:', data);
      const fileBlob = new Blob([data.Body]);
      const fileUrl = URL.createObjectURL(fileBlob);
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(fileUrl);
    } catch (error) {
      console.error('Erro ao baixar o arquivo:', error);
    }
  };

  const handleFileDownloadWebsite = async (fileName) => {
    const downloadParams = {
      Bucket: websiteName,
      Key: fileName,
    };

    try {
      const data = await s3.getObject(downloadParams).promise();
      console.log('Dados do arquivo:', data);
      const fileBlob = new Blob([data.Body]);
      const fileUrl = URL.createObjectURL(fileBlob);
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(fileUrl);
    } catch (error) {
      console.error('Erro ao baixar o arquivo:', error);
    }
  };

// =================Listagem de objetos dos BUCKETS para o usuário==================
const handleListObjects = async () => {
  const listParams = {
    Bucket: bucketName,
    Prefix: userName+"/",
  };

  try {
    const data = await s3.listObjectsV2(listParams).promise();
    setObjects(data.Contents);
    console.log('Objetos no bucket:', data.Contents);
  } catch (error) {
    console.error('Erro ao listar objetos:', error);
  }
};

const handleListObjectsFotos = async () => {
  const listParams = {
    Bucket: bucketfotosName,
    Prefix: userName+"/",
  };

  try {
    const data = await s3.listObjectsV2(listParams).promise();
    setFotos(data.Contents);
    console.log('Objetos no bucket:', data.Contents);
  } catch (error) {
    console.error('Erro ao listar objetos:', error);
  }
};

const handleListObjectsWebsite = async () => {
  const listParams = {
    Bucket: websiteName,
    Prefix: userName+"/",
  };

  try {
    const data = await s3.listObjectsV2(listParams).promise();
    setSiteObjetcs(data.Contents);
    console.log('Objetos no bucket:', data.Contents);
  } catch (error) {
    console.error('Erro ao listar objetos:', error);
  }
};

// ============Gerenciamento de arquivo
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <div className='App'>
    <header className='App-header'>
      <div className='bar'>
        <h1 >S3 Management Tool</h1>
        <div className='log'>
          <h3>User: {userName}</h3>
          <button className='logout' onClick={logout}>Logout</button>
        </div>
      </div>

      {showModal && (
                <div className="modal">
                <div className="modal-content">
                  <h2>Login</h2>
                  <p>Username</p>
                  <input
                    className="login-input"
                    placeholder="Username"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    required
                        />
                  <div className="modal-buttons">
                    <button className="buttons" onClick={() => {saveCredentials();setShowModal(false);refresh()}}>Login</button>
                  </div>
                  
                </div>
              </div>
      )}

      <div className='blocks'>
        <div className='block'>
          <h1 className='font'>Novo upload</h1>
          <div className='buttons'>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleFileUpload}>Upload em {bucketName}</button>
            <button onClick={handleFileUploadFotos}>Upload em {bucketfotosName}</button>
            <button onClick={handleFileUploadWebsite}>Upload em {websiteName}</button>
          </div>
        </div>

        <div className='block'>
          <h1 className='font'>Objetos em {bucketName}</h1>
          <div className='buttons'>
            {objects.map((item, index) => (
              <div key={index} >
                <button key={index} onClick={()=>handleFileDownload(item.Key)} >{item.Key.split('/')[1]}</button>
              </div>))
              }
          </div>
        </div>
      </div>

      <div className='blocks'>
        <div className='block'>
          <h1 className='font'>Objetos em {bucketfotosName}</h1>
          <div className='buttons'>
            {fotos.map((item, index) => (
              <div key={index} >
                <button key={index} onClick={()=>handleFileDownloadFotos(item.Key)} >{item.Key.split('/')[1]}</button>
              </div>))
              }
          </div>
        </div>
      
      <div className='block'>
          <h1 className='font'>Objetos em {websiteName}</h1>
          <div className='buttons'>
            {siteObjetcs.map((item, index) => (
              <div key={index} >
                <button key={index} onClick={()=>handleFileDownloadWebsite(item.Key)} >{item.Key.split('/')[1]}</button>
              </div>))
              }
          </div>
        </div>
        </div>

    </header>
    </div>
  );
};

export default App;
