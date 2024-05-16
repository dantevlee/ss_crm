import { Stack } from "@chakra-ui/react"
import ClientCard from "../components/ClientCard"
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const ArchivePage = () => {
  const [archives, setArchives] = useState([])

  const fetchArchives = async () =>{
    const token = Cookies.get("SessionID");

    try{
      const response = await axios.get(`http://localhost:3000/api/clients/archived`, {
        headers: {
          Authorization: `${token}`
        }
      })
      if (response.status === 200){
        setArchives(response.data)
      }
    } catch(error){
      console.error(error)
    }
  }

  useEffect(() => {
    fetchArchives()
  },[])

  return (
    <>
     <Stack direction="row" spacing={4}>
        {archives.map((a) => (
          <ClientCard mt={12} key={a.id} client={a}   />
        ))}
      </Stack>
    </>
  )
}

export default ArchivePage