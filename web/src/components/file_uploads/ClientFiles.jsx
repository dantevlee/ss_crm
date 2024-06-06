import { Button, Flex, Input } from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";

const ClientFiles = ({ onCancel, client }) => {

  const [file, setFile] = useState(null);

  const token = Cookies.get("SessionID");

  const uploadFile = async () => {

    const formData = new FormData();
    formData.append('file', file);

    try{
      axios.post(`http://localhost:3000/api/upload/client-file?client_id=${client.id}`, formData, {
      headers: {
      Authorization: `${token}`,
      'Content-Type': 'multipart/form-data'
    }}).then((res) => {
      console.log(res.data)
    })
    } catch(error){
      console.error(error)
    }
    
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <>
      <Input mt={8} type="file" onChange={handleFileChange} />
      <Flex mt={6} justifyContent="flex-start">
        <Button colorScheme="blue" onClick={uploadFile}>Save</Button>
        <Button ml={3} colorScheme="gray" onClick={handleCancel}>
          Cancel
        </Button>
      </Flex>
    </>
  );
};

export default ClientFiles;
