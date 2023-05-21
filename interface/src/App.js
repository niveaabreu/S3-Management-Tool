import React, { useEffect,useState } from 'react';
import AWS from 'aws-sdk';
import './App.css';

// Configuração das credenciais da AWS
AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();
const bucketName = 'fotos-projeto-130'; // Nome do bucket S3


const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [objects, setObjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState('');
  const [userName, setUserName] = useState('');

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

  const refresh = () => window.location.reload(true)


  const saveCredentials = () => {
    //handleModal();
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

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const logout = () => {
    setUser('');
    saveCredentials();
    setShowModal(true)
  };

  const handleFileDownload = async (fileName) => {

    const downloadParams = {
      Bucket: bucketName,
      Prefix: userName+"/",
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

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <div className='App'>
    <header className='App-header'>
      <h1 className='bar'>{userName} S3 Management Tool</h1>

      {showModal && (
                <div className="modal">
                <div className="modal-content">
                  <h2>Login</h2>
      
                  <p>Username</p>
                  <input
                            className="login-input"
                            placeholder="Application name"
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
    
       {objects.map((item, index) => (
        <div key={index} >
          <button key={index} onClick={()=>handleFileDownload(item.Key)} >{item.Key.split('/')[1]}</button>
        </div>))
        }
        
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>
      <button onClick={logout}>Logout</button>
      <button onClick={handleListObjects}>Listar Objetos</button>
    </header>
    </div>
  );
};

export default App;
