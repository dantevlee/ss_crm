import { Box, Button, Flex, Input, Link } from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const ClientFiles = ({ onCancel, client }) => {
  const [files, setFiles] = useState([])
  const [fileToUpload, setFileToUpload] = useState(null);

  const token = Cookies.get("SessionID");

  useEffect(() => {
    fetchFiles()
  }, [client.id])

  const fetchFiles = () => {
    try{
      axios.get(`http://localhost:3000/api/clients/${client.id}/files`, {
        headers: {
          Authorization: `${token}`
        }
      }).then((res) => {
        setFiles(res.data.files)
      })
    } catch(error){
      console.error(error)
    }
  }

  const uploadFile = async () => {

    const formData = new FormData();
    formData.append('file', fileToUpload);

    try{
      axios.post(`http://localhost:3000/api/upload/client-file?client_id=${client.id}`, formData, {
      headers: {
      Authorization: `${token}`,
      'Content-Type': 'multipart/form-data'
    }}).then((res) => {
      if(res.status === 200){
        fetchFiles()
        setFileToUpload(null)
      }
    })
    } catch(error){
      console.error(error)
    }
    
  }

  const downloadFile = async (fileName) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/clients/${client.id}/files/${fileName}`, {
        headers: {
          Authorization: `${token}`,
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading the file', error);
    }
  };

  const handleFileChange = (e) => {
    setFileToUpload(e.target.files[0]);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <>
      <Input mt={8} type="file" onChange={handleFileChange} />
      <Flex mt={6} justifyContent="flex-start">
        <Button colorScheme="blue" onClick={uploadFile}>Upload</Button>
        <Button ml={3} colorScheme="gray" onClick={handleCancel}>
          Cancel
        </Button>
      </Flex>
      <Box mt={6}>
        {files.length > 0 ? (
          files.map((file) => (
            <Link
            key={file.id}
            onClick={() => downloadFile(file.file_name)}
            color="teal.500"
            display="block"
            mt={2}
            cursor="pointer"
          >
            {file.file_name}
          </Link>
          ))
        ) : (
          <Box>No files available</Box>
        )}
      </Box>
    </>
  );
};

export default ClientFiles;
